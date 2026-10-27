/** Mock-only connector. No network requests or physical commands. */
export const mockConnector={
 id:'mock',
 describe(){return {id:'mock',label:'Local mock connector',live:false,version:'1.0'}},
 execute({resource,run,outcome}){
  if(!['success','failure'].includes(outcome))throw new Error('Unsupported mock outcome');
  return outcome==='failure'?{status:'failed',code:resource.type==='robot'?'ACTUATOR_CHECK':'UPSTREAM_TIMEOUT',message:resource.type==='robot'?'Simulated actuator safety check failed':'Simulated upstream model timeout',units:0,cost:0,charge:0}:{status:'succeeded',message:resource.type==='robot'?'Simulated inspection completed':'Simulated inference batch completed',units:resource.type==='robot'?24:1200,cost:resource.type==='robot'?9:0.48,charge:resource.type==='robot'?24:1.2};
 }
};
