// Separate networked test device. It never controls real hardware.
import os from 'node:os';
const base=process.env.OPENNOIR_URL||'http://127.0.0.1:4180',token=process.env.DEVICE_TOKEN;
if(!token){console.error('Set DEVICE_TOKEN to the one-time token from Connections → Add test device.');process.exit(1)}
const seen=new Map();let stopping=false;
async function request(path,body){let res=await fetch(new URL('/api/device/'+path,base),{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(8000)});let data=await res.json();if(!res.ok)throw Error(data.error||'Connection failed');return data}
process.on('SIGINT',()=>stopping=true);process.on('SIGTERM',()=>stopping=true);
console.log('opennoir device test client started. Simulated telemetry; no real robot connected.');
while(!stopping){try{let t=Date.now()/10000;await request('telemetry',{sequence:Date.now(),battery:Math.round(80+10*Math.sin(t/20)),health:100,location:{lat:40.745+Math.sin(t)*.002,lng:-73.99+Math.cos(t)*.002}});let commands=await request('commands');for(let c of commands){if(c.kind!=='diagnostics')continue;let result=seen.get(c.id)||{client:'opennoir simulator',simulated:true,platform:os.platform(),uptimeSeconds:Math.round(process.uptime()),checkedAt:new Date().toISOString()};seen.set(c.id,result);await request('ack',{id:c.id,result});if(seen.size>200)seen.delete(seen.keys().next().value)}console.log(new Date().toISOString()+' · Telemetry accepted · '+commands.length+' diagnostic requests')}catch(error){console.error('Connection unavailable: '+error.message)}await new Promise(r=>setTimeout(r,3000))}
