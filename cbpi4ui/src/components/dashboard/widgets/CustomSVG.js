import React from "react";
import { useEffect, useRef, useState, useCallback  } from "react";
import { useActor } from "../../data";
import { useModel } from "../DashboardContext";
import "../../../CustomSVG.css";
import { SvgLoader, SvgProxy } from 'react-svgmt';

 const CustomSVG = ({ id }) => {
    const model = useModel(id);
    const widget = model?.props.name;
    const ImportedSVGRef = useRef();
    const classNameON = model?.props.on;
    const classNameOFF = model?.props.off;
    const actor = useActor(model.props?.actor);
    const [fade, setFade] = useState(model.props.fade || "Fade");
    const [rotate, setRotate] = useState(model.props.rotate || '0deg')
    const [scale, setScale] = useState('scale(1,1)');
    const [svgNr, setNr] = useState("9999");
    var nr = "9999";
    
    const handleClasses = (classes) => {
        if (nr == "9999") {
            nr = id;
            setNr(id);
        }
        if (typeof classes.length !== 'undefined') {
          const output = classes.map((c, i) => {
            var cName = c.className.baseVal;
            c.className.baseVal = cName + '-' + nr;
            return c;
          });
        }
        else {
          var cName = classes.className.baseVal;
          classes.className.baseVal = cName + '-' + nr;
        }
    };
    
    const handleStyleElem = (svgStyle) => {
        var styleStr = svgStyle.outerHTML;
        styleStr = styleStr.replaceAll(/url\(#((\w|-)*)\);/g, 'url(#$1-'+ nr +');');
        styleStr = styleStr.replaceAll(/\.((\w|-)*)(\{| \{)/g, '.$1-'+ nr +'{');
        svgStyle.outerHTML = styleStr;
    };
    
    const handleGradients = (gradients) => {
        if (typeof gradients.length !== 'undefined') {
          const output = gradients.map((g, i) => {
            nr = g.id.substring(g.id.lastIndexOf("-")+1);
            setNr(g.id.substring(g.id.lastIndexOf("-")+1));
            if(g.href.baseVal.length > 0) {
                var base = g.href.baseVal;
                g.href.baseVal = base + '-' + nr;
            }
            return g;
          });
        }
        else 
        {
          nr = gradients.id.substring(gradients.id.lastIndexOf("-")+1);
          setNr(gradients.id.substring(gradients.id.lastIndexOf("-")+1));
          if(gradients.href.baseVal.length > 0) {
              var base = gradients.href.baseVal;
              gradients.href.baseVal = base + '-' + nr;
          }
        }
    };

    useEffect(() => {
      setFade(model.props.fade);
      setRotate(model.props.rotate);
      
      model.props.flip === 'None' ? setScale('scale(1,1)') : 
        model.props.flip === 'vertical' ? setScale('scale(-1,1)') : 
            model.props.flip === 'horizontal' ? setScale('scale(1,-1)') : 
                model.props.flip === 'both' ? setScale('scale(-1,-1)') : setScale('scale(1,1)')
    }, [model.props.fade, model.props.flip, model.props.rotate]);

    if(widget) {
      return (
        <div className="no-drag" >
          <SvgLoader width={model?.props?.width || 100} path={`/dashboard/static/${widget}.svg`} style={{ transform: `${scale} rotate(${rotate})` }} >
            
            <SvgProxy selector="linearGradient" onElementSelected={handleGradients} ></ SvgProxy>
            <SvgProxy selector="radialGradient" onElementSelected={handleGradients} ></ SvgProxy>
            <SvgProxy selector="[class]" onElementSelected={handleClasses} ></ SvgProxy>
            <SvgProxy selector="defs > style" onElementSelected={handleStyleElem} ></ SvgProxy>
            
            { classNameON ?  <SvgProxy selector={`.${classNameON}-${svgNr}`}  class={classNameON + "-" + svgNr + " " + fade } opacity={actor?.state ? "1" : "0"} /> : <div/> }
            { classNameOFF ? <SvgProxy selector={`.${classNameOFF}-${svgNr}`} class={classNameOFF + "-" + svgNr + " " + fade } opacity={actor?.state ? "0" : "1"} /> : <div/> }
        </SvgLoader>
        </div>
      );
    }
    else{
      return <div>MISSING CONFIG</div>
    }

  };
  
  export default CustomSVG

