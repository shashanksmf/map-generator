import React from 'react';
import Accordion from './src1/Accordion';
import AccordionItem  from './src1/AccordionItem';
//import 'normalize.css';
import './dropmenu.css';
import Tree from 'react-animated-tree';
import './styles.css';
import ContextMenu from './context/ContextMenu';
import ContentEditable from './ContentEditable';
import FileSelector from './FileSelector';
import Export from './Export';
var data = require('./sample.json');

let storeData = [];
let  disable = true;
let exportData ='';
let newNodeName = '';
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
      },
      storeData: storeData,
      opened:false,
      export:false,
      exportData:exportData,
      editable:'',
      isRename:false
    
    };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.contextMenuAction = this.contextMenuAction.bind(this);
    this.sendDataToParent = this.sendDataToParent.bind(this);
    this.sendNodeName = this.sendNodeName.bind(this)
    this.jsUcfirst = this.jsUcfirst.bind(this);
    this.isRenamed = this.isRenamed.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('contextmenu', this._handleDDContextMenu);
    document.addEventListener('click', this._handleDDContextMenu);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('contextmenu', this._handleDDContextMenu);
    document.removeEventListener('click', this._handleDDContextMenu);
  }

 

  _handleDDContextMenu = (Event) => {
    
    if(Event.srcElement.tagName != "SPAN") {
      this.setState({
        contextMenuShow:false,
        
      })
    }
    
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
//    console.log("activeItems",activeItems);
  //  this.setState({ activeClickedItems: activeItems });
  }

  isRenamed = (Event,params) => {
    if(Event.target.innerHTML == 'primary' || Event.target.innerHTML == 'secondary' 
    || Event.target.innerHTML == 'children'){

    }else{
     // alert('rename')
   
      this.setState({
        //editable:Event.target.innerHTML,
        treeSelected: params,
        isRename:true
      })
    }
  }
  treeClick = (Event,params) => {
  //  console.log("treeClick params",params);
  console.log('Event ',Event.type ,'params ', params);
  
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
        contextMenuShow: false,
        isRename:false
      })
    }
  }

  contextMenuAction = (action) => {
    let { id, key } = this.state.treeSelected;
    let { id: lastNodeId, count  } = this.state.clickCountData;
    
    if(action == "ADD") {  
      let modifiedData = mergeModifiedData(this.state.data, id, action, key, {
        "id": "AddItem_" + Math.random(0,100),
         "text": "Item",
      })
      if(modifiedData) {
        this.setState({
          data: modifiedData,
          contextMenuShow:false,
          clickCountData:{
            id,
            count: 0,
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
            count: 0,
          },
          contextMenuShow:false,
        })
      }
    }  
    else if (action == "CUT") {
      let modifiedData = mergeModifiedData(this.state.data, id, action, key, null)
      console.log('mofifiedData', modifiedData);
      if (modifiedData) {

        this.setState({
          data: modifiedData,
          storeData: {
            "id": id,
            "text": key
          },
          contextMenuShow: false,
        })
      }
    } 
    else if (action == "PASTE") {
      let modifiedData = mergeModifiedData(this.state.data, id, action, key, this.state.storeData)
      storeData = []
      if (Object.keys(this.state.storeData).length != 0) {
        if (modifiedData) {
          this.setState({
            data: modifiedData,
            storeData: {},
            contextMenuShow: false,
          })
          storeData = {}
        }
      } else if (Object.keys(this.state.storeData).length == 0) {
        this.setState({
          data: this.state.data,
          clickCountData: {
            id,
            count: 0,
          },
          contextMenuShow: false
        })
      }
    }
    else if(action == "IMPORT"){
      this.setState({
        opened: true,
        contextMenuShow:false
      })       
    } else if(action == "EXPORT"){
      let modifiedData = mergeModifiedData(this.state.data, id, action, key, this.state.data)
      console.log('mofifiedData', modifiedData);
     
      
      if (modifiedData) {

        this.setState({
          data: modifiedData,
          contextMenuShow: false,
          exportData:exportData,
          export:true
        })
      }
    } else if(action == "CLONE"){
      let modifiedData = mergeModifiedData(this.state.data, id, action, key, this.state.data)
      console.log('mofifiedData', modifiedData);
      if (modifiedData) {

        this.setState({
          data: modifiedData,
          storeData: {
            "id": id,
            "text": key
          },
          contextMenuShow: false,
        })
      }
    }
    else if(action == "RENAME") {

    }

  }
  sendNodeName = (nodeName) => {
    console.log('nodeName ',nodeName);
    
    let { id, key } = this.state.treeSelected;
    let modifiedData = mergeModifiedData(this.state.data, id, 'RENAME', key, nodeName)
    this.setState({
      data: modifiedData,
    })
  }
  sendDataToParent = (data) => {
    let { id, key } = this.state.treeSelected;
    let modifiedData = mergeModifiedData(this.state.data, id,"IMPORT" ,key, data);
    this.setState({
      data: modifiedData,
      opened: false
    })
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
      <FileSelector sendDataToParent={this.sendDataToParent} opened={this.state.opened} ></FileSelector>
     <Export clicked={this.state.export} data={this.state.exportData}></Export>
       <ContentEditable sendNodeName={this.sendNodeName} editable={this.state.editable}></ContentEditable>
        <Accordion>
          {Array.isArray(jsonData) && jsonData.map((i,item)=> {
            return (
              <AccordionItem key={item} title={`${i.id}`} expanded={this.state.activeClickedItems.includes(item)}>
                <div>
                  <App 
                    isRenamed={this.isRenamed}
                    onImportAction={this.readFile} 
                    jsonContent={i} 
                    key={i.id} 
                    treeClick={this.treeClick} 
                    isRename={this.state.isRename}
                    treeSelected={this.state.treeSelected}
                    />               
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

function searchTree(elementArr, matchingId) {
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
    console.log("treemap called");
    for(let j =0; j < elementArr.length;j++) {
      let element = elementArr[j]
      if(element.id == matchingId) {
        if ((action == "ADD") || (action == "PASTE" && Object.keys(data).length != 0)) {
          if (storeData.length != 0) {
            data = storeData[0]
          }
          if (element[key] && Array.isArray(element[key])) {
            element[key].push(data);
          }
          else {
            if(element.children && Array.isArray(element.children)) {
              console.log('element.children',element.children,element.children);

              element.children.push(data)
            } else {
              element.children = [];
              element.children.push(data)
            }
          }
        }
        else if (action == "REMOVE" || action == 'CUT') {
            if(element == 'children'){
              storeData.push(element)
            }
          if (element.children) {
            storeData.push(element)
            console.log('Cut node', element);
          }
          elementArr.splice(j, 1);
        }
        else if(action == 'CLONE'){
          if(element == 'children'){
            storeData.push(element);
          }
          if(element.children){
            storeData.push(element);
          }
          elementArr.concat(storeData);
        }  else if(action == 'IMPORT') {
          element[key].push(...data)
        }else if(action == 'EXPORT'){
        exportData=element;
        console.log('exportData ',exportData);
        }else if(action == 'RENAME'){
          console.log('element[key] ',element.text);
          console.log('data ',data);
          console.log('typeos ', typeof element.text);          
          element.text = data
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

const iconStyles = {
  display: 'inline-block',
 
}


let TreeMakerWithJson=function(props){
  var dataJ = props.treedata;
  var title = '';
  var tempTreeData = [];
  var keyList = [];
  var icon = '';
  
  Object.keys(dataJ).map(function(key1, index) {
    
    
      if(typeof dataJ[key1]!=="string" && dataJ[key1].length>0){
        var jsonVariable = {};
        jsonVariable[key1] = dataJ[key1];
        tempTreeData.push(jsonVariable);
        keyList.push(key1);
      } else if(key1 == 'text') {
        title = dataJ[key1];
        icon = `'${dataJ.data}'`;
        
      } else {
        return '';
      }
  })
  if(tempTreeData.length) {
    return (
    <Tree 
      id={dataJ.id + '_' + dataJ.text} 
      type={<img style={{display:"inline-block"}} src={dataJ.data}/>}
      content={
     
        <span 
          onClick={(Event) => props.treeClick(Event, { id: dataJ.id , key: title} )} 
          onContextMenu={(Event) => props.treeClick(Event, { id: dataJ.id , key: title}  )}
          onDoubleClick ={(Event) => props.isRenamed(Event, { id: dataJ.id , key: title})}
          contentEditable={(props.tempTreeData)?((props.treeSelected.text == title && props.isRename == true)?true:false):(props.isRename)}
          suppressContentEditableWarning={true}>{title}
            
        </span>
    
        }   
       open>
        <TreeMakerWithJsonArray 
        isRenamed ={props.isRenamed}
          treeClick={props.treeClick} 
          keyList={keyList} 
          treedata={tempTreeData} 
          isRename={props.isRename}
          id={dataJ.id}>
        </TreeMakerWithJsonArray></Tree>);
  } else {
    return (<div key={dataJ.id + '_' + title}><Tree 
    type={<img style={{display:"inline-block"}} src={dataJ.data}/>}
    content={
      
      <span 
       onDoubleClick ={(Event) => props.isRenamed(Event, { id: dataJ.id , key: title})}
        onClick={(Event) => props.treeClick(Event, { id: dataJ.id , key: title} )} 
        onContextMenu={(Event) => props.treeClick(Event, { id: dataJ.id , key: title}  )}
        contentEditable={(props.tempTreeData)?((props.treeSelected.text == title && props.isRename == true)?true:false):(props.isRename)}
        suppressContentEditableWarning={true}>{title}
          
      </span>
    
      } id={dataJ.id}  style={{color:'#81c081'}}></Tree></div>);
  }
}

let TreeMakerWithJsonArray = function(props){
    var dataJ = props.treedata;
    var keyList = props.keyList;
    return (
      dataJ.map((item, index) => {
        var key2 = keyList[index];
          if(typeof item[key2]!=="string" && item[key2].length>0){
            var text = (props.tempTreeData)?(props.treeSelected.text == key2 && props.isRename == true):('')
              console.log('text ',text);
            if(item[key2].length > 0) {
              return (<Tree  
                key={props.id + '_' + key2}
                type={<img style={{display:"inline-block"}} src={dataJ.data}/>}
                content={
                <span 
                 onDoubleClick ={(Event) => props.isRenamed(Event, { id: dataJ.id , key: key2})}
                  onClick={(Event) => props.treeClick(Event, { id: props.id , key: key2} )} 
                  onContextMenu={(Event) =>  props.treeClick(Event, { id: props.id , key: key2}  )}
                  contentEditable={(props.tempTreeData)?((props.treeSelected.text == key2 && props.isRename == true)?true:false):(props.isRename)}
                  suppressContentEditableWarning={true}>{key2}
                </span>
                }  
           
                >
                  <TreeMakerWithArray treedata={item[key2]} isRenamed={props.isRenamed} isRename={props.isRename} treeClick={props.treeClick}></TreeMakerWithArray>
               </Tree>);
            } else {
              var text = (props.tempTreeData)?(props.treeSelected.text == key2 && props.isRename == true):('')
              console.log('text ',text);
              
              return (<Tree key={props.id + '_' + key2} 
              type={<img style={{display:"inline-block"}} src={dataJ.data}/>}
            content={
                <span 
                onDoubleClick ={(Event) => props.isRenamed(Event, { id: dataJ.id , key: key2})}
                  onClick={(Event) => props.treeClick(Event, { id: props.id , key: key2} )} 
                  onContextMenu={(Event) =>  props.treeClick(Event, { id: props.id , key: key2}  )}
                  contentEditable={(props.tempTreeData)?((props.treeSelected.text == key2 && props.isRename == true)?true:false):(props.isRename)}
                  suppressContentEditableWarning={true}>
                  {key2}
                </span>
                }   ></Tree>);
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
        return <TreeMakerWithJson treedata={item} isRename={props.isRename} isRenamed={props.isRenamed} treeClick={props.treeClick}></TreeMakerWithJson>;
      })
    )   
}

let App = function(props) {
    return (
      <div>
        <TreeMakerWithJson 
          treedata={props.jsonContent} 
          treeClick={props.treeClick} 
          treeSelected={props.treeSelected}
          isRename={props.isRename}
          isRenamed={props.isRenamed}
          >
            
          </TreeMakerWithJson>
      </div>
    )  
}
