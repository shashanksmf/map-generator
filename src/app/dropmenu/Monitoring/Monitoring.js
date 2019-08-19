import React, { Component } from 'react'
import Tree from 'react-animated-tree';

import Accordion from '../src1/Accordion';
import AccordionItem  from '../src1/AccordionItem';

var data = require('../sampleMonitoringData.json');

export class Monitoring extends Component {
    constructor(props) {
        super();
        this.state = {
            activeClickedItems: [0],
            data: data,
        }
    }
    render() {
        let jsonData = this.state.data
        return (
            <div>
              <Accordion>
          {Array.isArray(jsonData) && jsonData.map((i,item)=> {
            return (
              <AccordionItem key={item} title={`${i.id}`} expanded={this.state.activeClickedItems.includes(item)}>
                <div>
                  <App jsonContent={i} key={i.id} />      
                  
                </div>
                
              </AccordionItem>
            );
            })
          }
        </Accordion>  
            </div>
        )
    }
}

export default Monitoring

let TreeArray = function (props) {
 
  let treeDataArr = props.tempTreeData;
  console.log('treeDataArr ',treeDataArr);
  return (
    <div>
      {/* {treeDataArr.map((node,i)=> {
          console.log('i',i,'node',node);
          return <Tree content={node} open>
            
              </Tree>
      }) */}
    
    </div>
  )  
    
}


  
  let App = function(props) {
     // console.log('props App',props);
     let treeData = []
     let tempTreeData =[]
      Object.keys(props).map(function(key1, index) {
         console.log('map props',key1,  props[key1]);
            
        if(typeof props[key1] == 'object') {
            Object.keys(props[key1]).map(function(key,index){
                if(typeof props[key1][key] == 'object'){
                    props[key1][key].forEach(node => {
                        console.log('node', node.children);
                        if(node.children){
                            tempTreeData.push(node.children)
                            treeData.push(node.text)
                        }else{
                            treeData.push(node.text)
                        }   
                    });
                        
               }
           })
       
      } else {
        return '';
      }
     })
      return (
        <div>
          {treeData.map((node,i)=> {
              console.log('i',i,'node',node);
              return <Tree content={node} open>
                  <TreeArray tempTreeData={tempTreeData} >
                  </TreeArray>
                  </Tree>
          })
        }
        </div>
      )  
  }
  