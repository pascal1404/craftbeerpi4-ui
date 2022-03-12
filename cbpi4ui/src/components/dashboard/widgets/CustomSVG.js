
import React from "react";
import { useEffect, useRef, useState, useCallback  } from "react";
import { useActor } from "../../data";
import { useModel } from "../DashboardContext";
import "../../../CustomSVG.css";
import { SvgLoader, SvgProxy } from 'react-svgmt';
import RWSVG from './svg/Ruehrwerk_s_ON.svg';

import { ReactComponent as RWSVG2 } from './svg/Ruehrwerk_s_ON.svg';

/*
function useDynamicSVGImport(name, options = {}) {
  const ImportedIconRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const { onCompleted, onError } = options;
  useEffect(() => {
    setLoading(true);
    const importIcon = async () => {
      try {
        ImportedIconRef.current = (
          await import(`./svg/${name}.svg`)
        ).ReactComponent;
        if (onCompleted) {
          onCompleted(name, ImportedIconRef.current);
        }
      } catch (err) {
        if (onError) {
          onError(err);
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    importIcon();
  }, [name, onCompleted, onError]);

  return { error, loading, SvgIcon: ImportedIconRef.current };
}

/**
 * Simple wrapper for dynamic SVG import hook. 
 */
 /*
const Icon = ({ name, onCompleted, onError, ...rest }) => {
  const { error, loading, SvgIcon } = useDynamicSVGImport(name, {
    onCompleted,
    onError
  });
  if (error) {
    return error.message;
  }
  if (loading) {
    return "Loading...";
  }
  if (SvgIcon) {
    return <SvgIcon {...rest} />;
  }
  return null;
};
*/


 const CustomSVG = ({ id }) => {
    const model = useModel(id);
    const widget = model?.props.name;
    const classNameON = model?.props.on;
    const classNameOFF = model?.props.off;
    const actor = useActor(model.props?.actor);
    const [fade, setFade] = useState(model.props.fade || "Fade");
    const [scale, setScale] = useState('scale(1,1)');

/*  const handleOnCompleted = useCallback(
    (iconName) => console.log(`${iconName} successfully loaded`),
    []
  );

  const handleIconError = useCallback((err) => console.error(err.message), []);
return <Icon name={nameON} onCompleted={handleOnCompleted} onError={handleIconError} className={ `${fade} no-drag` } width={model?.props?.width || 100} height="auto" opacity={actor?.state ? 1 : 0} title='SVG FOR ACTOR ON'/> 
return <Icon name={nameON} onCompleted={handleOnCompleted} onError={handleIconError} width={model?.props?.width || 100} height="auto" className="no-drag" title='SVG'/>
*/

    useEffect(() => {
      setFade(model.props.fade);
      
      model.props.flip == 'None' ? setScale('scale(1,1)') : 
        model.props.flip == 'vertical' ? setScale('scale(-1,1)') : 
            model.props.flip == 'horizontal' ? setScale('scale(1,-1)') : 
                model.props.flip == 'both' ? setScale('scale(-1,-1)') : setScale('scale(1,1)')
    }, [model.props.fade, model.props.flip]);


    if(widget) {
      return (
        <div className="no-drag" >
          <RWSVG2 width="1" height="1" opacity="0" />
          <SvgLoader width={model?.props?.width || 100} height="auto" path={RWSVG} style={{ transform: `${scale} rotate(${model.props.rotate})` }} >
            { classNameON ?  <SvgProxy selector={`.${classNameON}`}  class={classNameON  + " " + fade } opacity={actor?.state ? "1" : "0"} /> : <div/> }
            { classNameOFF ? <SvgProxy selector={`.${classNameOFF}`} class={classNameOFF + " " + fade } opacity={actor?.state ? "0" : "1"} /> : <div/> }
        </SvgLoader>
        </div>
      );
    }
    else{
      return <div>MISSING CONFIG</div>
    }

  };
  
  export default CustomSVG

