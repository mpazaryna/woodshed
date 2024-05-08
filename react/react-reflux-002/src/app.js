/** @jsx React.DOM */

var React = require("react");
var Reflux = require("reflux");

var store = Reflux.createStore({
   getInitialState(){
     return {
       name: "phlnu415v",
       status: "Up",
       productionState: "Installed-Active", 
       priority: "Non-Managed",
       ip: "127.0.0.1",
       hardwareManufacturer: "Red Hat",
       hardwareModel: "SystemEDGE 4.3.6",
       osManufacturer: "/zport/dmd/Manufacturers/RedHat",
       osModel: "2.6.32-279.19.1.el6.x86_64, Red Hat Enterprise Linux Server release 6.3 (Santiago)",
       systems: "SAS OSS TOOLS",
       location: "/US/PA/PHILADELPHIA.011",
       serialNumber: "SVR0000005005",
       tagNumber: "-0-",
       rackSlot: "0",
       snmpSysname: "phlnu415v.oamp.xyz.net",
       snmpLocation: "See Service Center",
       snmpContact: "See Service Center",
       snmpDescription: "See Service Center",
       snmpVersion: "v2c",
       assetGuid: "lorem asset guid",
       companyOwn: "lorem company own",
       type: "lorem type",
       description: "lorem Description",
       circuitCategory: "lorem circuit Category",
       vendorId: "lorem vendorId",
       activeDate: "lorem active date"         
     }       
   }   
})

var App = React.createClass({     
      mixins: [Reflux.connect(store)],
      render() {
        return(
          <div>    
            <dl>        
              <dt>Name</dt>
              <dd>{this.state.name}</dd>   
              <dt>Status</dt>  
              <dd>{this.state.status}</dd>  
              <dt>Production state</dt>  
              <dd>{this.state.productionState}</dd>  
              <dt>Priority</dt>
              <dd>{this.state.priority}</dd>
              <dt>IP</dt>
              <dd>{this.state.ip}</dd>
              <dt>Hardware Manufacturer</dt>
              <dd>{this.state.hardwareManufacturer}</dd>
              <dt>OS Manufacturer</dt>
              <dd>{this.state.osManufacturer}</dd>
              <dt>OS Model</dt>
              <dd>{this.state.osModel}</dd>
              <dt>Systems</dt>
              <dd>{this.state.systems}</dd>
              <dt>Location</dt>
              <dd>{this.state.location}</dd>
              <dt>Serial Number</dt>
              <dd>{this.state.serialNumber}</dd>
              <dt>Tag Number</dt>
              <dd>{this.state.tagNumber}</dd>
              <dt>Rack Slot</dt>
              <dd>{this.state.rackSlot}</dd>
              <dt>SNMP Sysname</dt>
              <dd>{this.state.snmpSysname}</dd>
              <dt>SNMP Location</dt>
              <dd>{this.state.snmpLocation}</dd>
              <dt>SNMP Contact</dt>
              <dd>{this.state.snmpContact}</dd>  
              <dt>SNMP Description</dt>
              <dd>{this.state.snmpDescription}</dd>          
              <dt>SNMP Version</dt>
              <dd>{this.state.snmpVersion}</dd>    
              <dt>Asset Guid</dt>
              <dd>{this.state.assetGuid}</dd>          
              <dt>Owner</dt>
              <dd>{this.state.companyOwn}</dd>           
              <dt>Type</dt>
              <dd>{this.state.type}</dd>                
              <dt>Description</dt>
              <dd>{this.state.description}</dd>         
              <dt>Circuit Category</dt>
              <dd>{this.state.circuitCategory}</dd>   
              <dt>Telco Vendor ID</dt>
              <dd>{this.state.vendorId}</dd>      
              <dt>Active Date</dt>
              <dd>{this.state.activeDate}</dd>
            </dl>
          </div>                  
        );
      }
})

React.render(<App />, document.body)