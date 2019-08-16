
import React from 'react';
import Accordion from './src1/Accordion';
import AccordionItem  from './src1/AccordionItem';
//import 'normalize.css';
import './dropmenu.css';
import Tree from 'react-animated-tree';
import './styles.css';



var data = require('./sample.json');





export default class Dropmenu extends React.Component {
  constructor(props) {
    super();

    this.state = {
      activeClickedItems: [0]
      
    };

    this.toggleActive = this.toggleActive.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
    this.setState({ activeClickedItems: activeItems });
  }





  
  render() {
    console.log("data",data)
    return (
      <div className="wrapper-container">
      <div className="demo-container">
        <Accordion>
          {data.map((i,item)=> {
            return (
              <AccordionItem key={item} title={`${i.id}`} expanded={this.state.activeClickedItems.includes(item)}>
                <div>
                  <App jsonContent={i} key={i.id}/>
                  <div id="my-test">this is test</div>
                  
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
    var dataJ=props.treedata;
    var title = '';
    var tempTreeData = [];
    var keyList = [];
    console.log('TreeMakerWithJson',props);
    
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
      return (<Tree content={title} canHide open><TreeMakerWithJsonArray keyList={keyList} treedata={tempTreeData}></TreeMakerWithJsonArray></Tree>);
    } else {
      return (<div><Tree content={title} canHide style={{color:'#81c081'}} ></Tree></div>);
    }
 }

  let TreeMakerWithJsonArray=function(props){
    var dataJ=props.treedata;
    var keyList = props.keyList;
    return (
      dataJ.map((item, index) => {
        var key2 = keyList[index];
          if(typeof item[key2]!=="string" && item[key2].length>0){
            if(item[key2].length > 1) {
              return (<Tree content={key2} canHide><TreeMakerWithArray treedata={item[key2]}></TreeMakerWithArray></Tree>);
            } else {
              return (<Tree content={key2} canHide></Tree>);
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
        return <TreeMakerWithJson treedata={item} key={"dataJMap-"+index}></TreeMakerWithJson>;
      })
    )
   
 }
let App = function(props) {
  //
    console.log("props app",props)
    return(
      <div>
        <TreeMakerWithJson treedata={props.jsonContent} ></TreeMakerWithJson>
      </div>
    )
  
}
