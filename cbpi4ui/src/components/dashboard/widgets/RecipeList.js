import { Button, Typography } from "@material-ui/core";
import { default as React, useEffect, useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import WaterIcon from '@mui/icons-material/Water';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {CBPiGrainIcon, CBPiYeastIcon, CBPiHopsIcon} from '../../util/icons/CBPiSensorIcon';
import { useCBPi } from "../../data";
import { useDraggable, useModel } from "../DashboardContext";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import { useHistory } from "react-router-dom";


const NestedList = (props) => {
    const Items = props.items;
    
    const primaryprops = {
      fontSize: (props.size -3 )+"pt",
      fontFamily: "Advent Pro"
    };
    
    const NestList = Items.map((Elem) =>
      <div>
        <ListItem sx={{ height : 30 }} >
          <ListItemIcon>
            <ArrowRightIcon className="icons" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ style: primaryprops }} primary={Elem} />
        </ListItem>
      </ div>
    );
    return(NestList);
}


const NumberList = (props) => {
    const listElem = ["Water","Malt","Hop","Yeast"];
    const iconList = [WaterIcon, CBPiGrainIcon, CBPiHopsIcon, CBPiYeastIcon];
    const nestedItems = props.items;
    const [open, setOpen] = useState([false,false,false,false]);
    
    const primaryprops = {
      fontSize: (props.size -3 )+"pt",
      fontFamily: "Advent Pro"
    };
    
    const handleClickItem = (i) => {
      const newState = [...open];
      newState[i] = !open[i];
      setOpen(newState);
    };
  
    const listItems = iconList.map((Icon, idx) =>
    <div>
      <ListItemButton onClick={handleClickItem.bind(this, idx)}>
        <ListItemIcon>
          <Icon className="icons" />
        </ListItemIcon>
        <ListItemText primaryTypographyProps={{ style: primaryprops }} primary={listElem[idx]} />
        {open[idx] ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open[idx]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <NestedList size={props.size} items={nestedItems[idx]} />
        </List>
      </Collapse>
      </ div>
    );
    return(listItems);
}



export const RecipeList = ({ id }) => {
  const model = useModel(id);
  const { state } = useCBPi();
  const history = useHistory();
  const draggable = useDraggable();
  const [ingridients, setIng] = useState([]);
    
  useEffect(() => {
    var myRegexp = new RegExp("water:((.|\n)*)malt:((.|\n)*)hops:((.|\n)*)yeast:((.|\n)*)", "g");
    var match = myRegexp.exec(state.mashBasic.desc);
    if(match){
      const output = match.map((e, i) => {
        e = e.replace(/\n/gm,"");
        e = e.split(';');
        return e.filter(String);
      });
      
      output.shift();
      var temp = output.filter(String);
      setIng(temp);
    }
    else {
        setIng([["-","-"],["-"],["-"],["-"]])
    }
  }, [state.mashBasic.desc]);

  let inputStyle = { color: "#fff", width: `${model?.props?.width}px`,fontSize: `${model?.props?.namesize}pt`, backgroundColor: "#2c282e", padding: 5, borderRadius: 5 };

  if( draggable) {
    return <div className="box" style={{...inputStyle, display:"flex", justifyContent: "center", alignItems: "center"}}>
      <Typography variant="h6">Recipe List</Typography>
    </div>
  }

  if (!state.mashBasic.name) {
    return (
      <div className="box" style={{...inputStyle, display:"flex", justifyContent: "center", alignItems: "center"}}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            history.push("/recipes");
          }}
          startIcon={<MenuBookIcon />}
        >
          Please select a Recipe
        </Button>
      </div>
    );
  }

  return (
    <div className="box" style={inputStyle}>
      <div style={{ marign: 20 }}>
      <div className="section_header">Ingridients for {state.mashBasic?.name}</div>
        <List component="nav" aria-label="main mailbox folders" >
          <NumberList size={model.props.stepsize} items={ingridients} />
        </List>
      </div>
    </div>
  );
};

export default RecipeList;
