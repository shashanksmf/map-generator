
import React from 'react';
import './ContextMenu.css';
export default class ContextMenu extends React.Component {
    state = {
        visible: false,
    };

    componentWillReceiveProps(nextPros) {
        console.log("nextPros",nextPros.visible)
        this.setState({
            visible: nextPros.visible
        })
    }
    
    componentDidMount() {
       document.addEventListener('contextmenu', this._handleContextMenu);
       document.addEventListener('click', this._handleClick);
       document.addEventListener('scroll', this._handleScroll);
    };

    componentWillUnmount() {
       document.removeEventListener('contextmenu', this._handleContextMenu);
       document.removeEventListener('click', this._handleClick);
       document.removeEventListener('scroll', this._handleScroll);
    }
    
    _handleContextMenu = (event) => {
        console.log("this.state.visible",this.state.visible)
        if(!this.state.visible) return false
        event.preventDefault();
        
        this.setState({ visible: true });
        
        const clickX = event.clientX;
        const clickY = event.clientY;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const rootW = this.root.offsetWidth;
        const rootH = this.root.offsetHeight;
        
        const right = (screenW - clickX) > rootW;
        const left = !right;
        const top = (screenH - clickY) > rootH;
        const bottom = !top;
        
        if (right) {
            this.root.style.left = `${clickX + 5}px`;
        }
        
        if (left) {
            this.root.style.left = `${clickX - rootW - 5}px`;
        }
        
        if (top) {
            this.root.style.top = `${clickY + 5}px`;
        }
        
        if (bottom) {
            this.root.style.top = `${clickY - rootH - 5}px`;
        }
    };

    _handleClick = (event) => {
        // const { visible } = this.state;
        // const wasOutside = !(event.target.contains === this.root);
        // if (wasOutside && visible) this.setState({ visible: false, });
    };

    _handleScroll = () => {
        const { visible } = this.state;
        
        if (visible) this.setState({ visible: false, });
    };
    
    render() {
        const { visible } = this.state;
        
        return(visible || null) && 
            <div ref={ref => {this.root = ref}} className="contextMenu">
                <div className="contextMenu--option" onClick={() => {
                    console.log("contextMenu Props", this.props)
                    this.props.contextMenuAction("ADD")
                }}>Add Node</div>
                <div className="contextMenu--option" onClick={() => this.props.contextMenuAction("REMOVE")}>Remove Node</div>
                <div className="contextMenu--option" onClick={() => this.props.contextMenuAction("CUT")}>Cut Node</div>
                <div className="contextMenu--option" onClick={() => this.props.contextMenuAction("PASTE")}>Paste Node</div>
            </div>
    };
}

