import React from 'react';
import Accordion from './src1/Accordion';
import AccordionItem  from './src1/AccordionItem';
//import 'normalize.css';
import './dropmenu.css';
import Tree from 'react-animated-tree';
import './styles.css';
import ContextMenu from './context/ContextMenu';

var data = require('./sample.json');





export default class Dropmenu extends React.Component {
  constructor(props) {
    super();

    this.state = {
      activeClickedItems: [0],
      contextMenuShow:null,
      treeSelected:null,
      data: data,
      clickCountData: {
        id: null,
        count:0,
      }
    };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.contextMenuAction = this.contextMenuAction.bind(this);
    this.jsUcfirst = this.jsUcfirst.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  toggleActive(index) {
    const position = this.state.activeClickedItems.indexOf(index);

    if (position !== -1) {
      this.setState({ activeClickedItems: [] });
    } else {
      this.setState({ activeClickedItems: [index] });
    }
  }

  handleClick({ activeItems }) {
    console.log("activeItems",activeItems);
    this.setState({ activeClickedItems: activeItems });
  }

  treeClick = (Event,params) => {
    console.log("treeClick params",params);
    Event.persist();
    if(Event.type == "contextmenu") {
      this.setState({
        contextMenuShow: true,
        treeSelected: params
      })
      return true;
    }
    this.props.selectedServices(params.key)
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      // alert('You clicked outside of me!');
      this.setState({
        contextMenuShow: false
      })
    }
  }

  contextMenuAction = (action) => {
    let { id, key } = this.state.treeSelected;
    let { id: lastNodeId, count  } = this.state.clickCountData;
    
    if(count < 5 ) {
      this.setState({
        clickCountData:{
          id,
          count: lastNodeId != id ?  0 : count+1,
        }
      })
      return;
    } 
    if(action == "ADD") {  
      let modifiedData = mergeModifiedData(this.state.data, id, action, key, {
        "id": "AddItem_" + Math.random(0,100),
        "text": "Item",
      })
      console.log("after modified", modifiedData);
      if(modifiedData) {
        this.setState({
          data: modifiedData,
          contextMenuShow:false,
          clickCountData:{
            id,
            count: lastNodeId != id ?  0 : count++,
          }
        })
      }
      
    }
    else if(action == "REMOVE") {
      let modifiedData = mergeModifiedData( this.state.data, id, action, key, null)
      if(modifiedData) {
        this.setState({
          data:modifiedData,
          clickCountData:{
            id,
            count: lastNodeId != id ?  0 : count++,
          },
          contextMenuShow:false,
        })
      }
    }

  }
  
  jsUcfirst = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  render() {
    let jsonData = this.state.data
    return (
      <div className="wrapper-container">
      <div className="demo-container" ref={this.setWrapperRef}>
      <ContextMenu visible={this.state.contextMenuShow} contextMenuAction={this.contextMenuAction}></ContextMenu>
                  
        <Accordion>
          {Array.isArray(jsonData) && jsonData.map((i,item)=> {
            return (
              <AccordionItem key={item} title={`${i.id}`} expanded={this.state.activeClickedItems.includes(item)}>
                <div>
                  <App jsonContent={i} key={i.id} treeClick={this.treeClick} />               
                </div>
              </AccordionItem>
            );
            })
          }
        </Accordion>

        
      </div>
      </div>
    );
  }
}

function searchTree(elementArr, matchingId){
  for(let j =0; j< elementArr.length;j++) {
    let element = elementArr[j]
    if(element.id == matchingId){
      return element;
    }else if (element.children != null){
          var i;
          var result = null;
          for(i=0; result == null && i < element.children.length; i++){
              result = searchTree(element.children[i], matchingId);
          }
          return result;
    }
  }
  return null;
}

function mergeModifiedData(elementArr, matchingId, action, key, data) {
  function treeMap(elementArr, matchingId, action, key, data) {
    for(let j =0; j < elementArr.length;j++) {
      let element = elementArr[j]
      console.log("element.id",matchingId,element.id)
      if(element.id == matchingId) {
        if(action == "ADD") {
          if(element[key] && Array.isArray(element[key])) {
            element[key].push(data)
          } 
          else {
            if(element.children && Array.isArray(element.children)) {
              element.children.push(data)
            } else {
              element.children = [];
              element.children.push(data)
            }
          }
        } 
        else if(action == "REMOVE") {
          //eslint-ignore-next-line
          elementArr.splice(j,1);
        }
      } else {
          var result = null;
          for(let elementKeys in element) {
            if(Array.isArray(element[elementKeys]) && element[elementKeys].length > 0) {
              // for(let i=0; i < element[elementKeys].length; i++) {
                treeMap(element[elementKeys], matchingId, action, key ,data);
              // }
            }
          };
        }
      }
  }
  treeMap(elementArr, matchingId, action, key, data);
  return elementArr;
}

const treeStyles = {
  position: 'absolute',
  top: 20,
  color: '#008000',
  fill: 'black',
  width: '100%',
  border:0

}

const typeStyles = {
  fontSize: '3em',
  verticalAlign: 'middle'
}

let TreeMakerWithJson=function(props){
  var dataJ = props.treedata;
  var title = '';
  var tempTreeData = [];
  var keyList = [];
  // console.log('TreeMakerWithJson',props);
  
  Object.keys(dataJ).map(function(key1, index) {
      if(typeof dataJ[key1]!=="string" && dataJ[key1].length>0){
        var jsonVariable = {};
        jsonVariable[key1] = dataJ[key1];
        tempTreeData.push(jsonVariable);
        keyList.push(key1);
      } else if(key1 == 'text') {
        title = dataJ[key1];
      } else {
        return '';
      }
  })
  if(tempTreeData.length) {
    return (
    <Tree 
      id={dataJ.id + '_' + dataJ.text} 
      content={
        <span 
          onClick={(Event) => props.treeClick(Event, { id: dataJ.id , key: title} )} 
          onContextMenu={(Event) => props.treeClick(Event, { id: dataJ.id , key: title}  )}>{title}
            
        </span>
        }   
      canHide 
      open>
        <TreeMakerWithJsonArray 
          treeClick={props.treeClick} 
          keyList={keyList} 
          treedata={tempTreeData} 
          id={dataJ.id}>
        </TreeMakerWithJsonArray></Tree>);
  } else {
    return (<div><Tree content={
      <span 
        onClick={(Event) => props.treeClick(Event, { id: dataJ.id , key: title} )} 
        onContextMenu={(Event) => props.treeClick(Event, { id: dataJ.id , key: title}  )}>{title}
          
      </span>
      } id={dataJ.id} canHide style={{color:'#81c081'}}></Tree></div>);
  }
}

let TreeMakerWithJsonArray = function(props){
    var dataJ = props.treedata;
    var keyList = props.keyList;
    return (
      dataJ.map((item, index) => {
        var key2 = keyList[index];
          if(typeof item[key2]!=="string" && item[key2].length>0){
            if(item[key2].length > 1) {
              return (<Tree  
                key={props.id + '_' + key2}
                content={
                <span 
                  onClick={(Event) => props.treeClick(Event, { id: props.id , key: key2} )} 
                  onContextMenu={(Event) =>  props.treeClick(Event, { id: props.id , key: key2}  )}>{key2}
                </span>
                }  
                canHide>
                  <TreeMakerWithArray treedata={item[key2]} treeClick={props.treeClick}></TreeMakerWithArray></Tree>);
            } else {
              return (<Tree  key={props.id + '_' + key2} type="Apple" content={key2} canHide></Tree>);
            }
          } else {
            return '';
          }
      })
    )
    
 }

 let TreeMakerWithArray=function(props){
    var dataJ = props.treedata;
    return (
      dataJ.map((item, index) => {
        return <TreeMakerWithJson treedata={item} treeClick={props.treeClick}></TreeMakerWithJson>;
      })
    )   
}

let App = function(props) {
    return (
      <div>
        <TreeMakerWithJson treedata={props.jsonContent} treeClick={props.treeClick} ></TreeMakerWithJson>
      </div>
    )  
}
