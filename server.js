import {catalog} from './platform.js';
import {randomUUID} from 'node:crypto';
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,extname} from 'node:path';
import {Store} from './store.js';
import {DomainError} from './domain.js';
import {mockConnector} from './adapter.js';
const root=fileURLToPath(new URL('./public/',import.meta.url));
export function createApp({dbPath=fileURLToPath(new URL('./data/opennoir.sqlite',import.meta.url))}={}){
 const store=new Store(dbPath);
 const server=http.createServer(async(req,res)=>{const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data))};try{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  if(!/^((localhost|127\.0\.0\.1)(:\d+)?)$/.test(req.headers.host||''))return send(403,{error:'Local host required'});
  const url=new URL(req.url,'http://'+req.headers.host);
  if(url.pathname.startsWith('/api/')){
   if(req.headers.origin&&req.headers.origin!==url.origin)return send(403,{error:'Cross-origin requests are not allowed'});
   if(req.method==='GET'&&url.pathname==='/api/workspaces')return send(200,store.list());
   if(req.method==='GET'&&url.pathname==='/api/connectors')return send(200,[mockConnector.describe()]);
   let workspace=req.headers['x-workspace-id']||(url.pathname.startsWith('/api/attachments/')?url.searchParams.get('workspace'):null)||'northstar',scope=url.searchParams.get('customer')||null;
   if(req.method==='GET'&&url.pathname==='/api/catalog')return send(200,catalog);
   if(req.method==='GET'&&url.pathname.startsWith('/api/directory/')){let id=url.pathname.split('/').at(-1).toUpperCase();let entry=store.lookup(id);if(!entry)return send(404,{error:'No local demo profile found for this opennoir ID'});return send(200,entry)}
   if(req.method==='POST'&&url.pathname==='/api/attachments'){
    if(!req.headers['content-type']?.startsWith('application/json'))return send(415,{error:'JSON required'});let chunks=[],size=0;for await(let chunk of req){size+=chunk.length;if(size>3000000)return send(413,{error:'Screenshot too large. Maximum 2 MB.'});chunks.push(chunk)}let body;try{body=JSON.parse(Buffer.concat(chunks).toString())}catch{return send(400,{error:'Invalid upload'})}if(!body||!['image/png','image/jpeg','image/webp'].includes(body.mime)||typeof body.data!=='string'||!/^[A-Za-z0-9+/]*={0,2}$/.test(body.data))return send(400,{error:'Use a PNG, JPEG or WebP screenshot'});let bytes=Buffer.from(body.data,'base64');if(bytes.length>2097152||bytes.length<12)return send(413,{error:'Use a valid screenshot up to 2 MB'});let valid=body.mime==='image/png'?bytes.subarray(0,8).toString('hex')==='89504e470d0a1a0a':body.mime==='image/jpeg'?bytes.subarray(0,3).toString('hex')==='ffd8ff':bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP';if(!valid)return send(400,{error:'File contents do not match its image type'});return send(201,store.addAttachment(workspace,'attachment-'+randomUUID(),body.mime,String(body.name||'Screenshot').replace(/[\r\n]/g,' ').slice(0,100),bytes));
   }
   if(req.method==='GET'&&url.pathname.startsWith('/api/attachments/')){let item=store.attachment(workspace,url.pathname.split('/').at(-1));if(!item)return send(404,{error:'Screenshot not found in this workspace'});res.writeHead(200,{'Content-Type':item.mime,'Cache-Control':'no-store','Content-Disposition':'inline'});return res.end(Buffer.from(item.content))}
   if(req.method==='GET'&&url.pathname==='/api/feedback')return send(200,{comments:store.read(workspace).feedback||[]});
   if(req.method==='GET'&&url.pathname==='/api/state')return send(200,store.read(workspace,scope));
   if(req.method==='POST'&&url.pathname==='/api/commands'){
    if(!req.headers['content-type']?.startsWith('application/json'))return send(415,{error:'JSON required'});
    let parts=[],length=0;for await(const chunk of req){length+=chunk.length;if(length>32768)return send(413,{error:'Request too large'});parts.push(chunk)}
    let body;try{body=JSON.parse(Buffer.concat(parts).toString())}catch{return send(400,{error:'Invalid JSON'})}
    if(!body||typeof body!=='object'||Array.isArray(body))return send(400,{error:'Command object required'});
    return send(200,{result:store.execute(workspace,body,scope,body.revision)});
   }return send(404,{error:'API route not found'});
  }
  if(req.method!=='GET'&&req.method!=='HEAD')return send(405,{error:'Method not allowed'});
  let path;try{path=decodeURIComponent(url.pathname)}catch{return send(400,{error:'Invalid path'})}let file=resolve(root,'.'+(path==='/'?'/index.html':path));if(!file.startsWith(root))return send(404,{error:'Not found'});
  let content;try{content=await readFile(file)}catch{return send(404,{error:'Not found'})}let type={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'}[extname(file)]||'application/octet-stream';res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:content);
 }catch(e){send(e instanceof DomainError?e.status:500,{error:e instanceof DomainError?e.message:'Internal server error'});if(!(e instanceof DomainError))console.error(e)}});
 server.on('close',()=>store.close());return {server,store};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){let port=Number(process.env.PORT||4180);let {server}=createApp({dbPath:process.env.DATA_PATH||undefined});server.listen(port,'127.0.0.1',()=>console.log(`opennoir ready: http://127.0.0.1:${port}`));for(let signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)))}
