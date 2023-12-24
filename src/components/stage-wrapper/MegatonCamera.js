import React from "react";
import Webcam from 'react-webcam';
import { useRef, useEffect } from 'react';
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import {setNumberOfObject, setDetectedObjects} from 'scratch-vm/src/util/meta_bt'

const drawRect = (detections, ctx) =>{
    // Loop through each prediction
    detections.forEach(prediction => {
  
      // Extract boxes and classes
      const [x, y, width, height] = prediction['bbox']; 
      const text = prediction['class']; 
  
      // Set styling
      const color = Math.floor(Math.random()*16777215).toString(16);
      ctx.strokeStyle = '#'
      ctx.font = '40px Arial';
      
  
      // Draw rectangles and text
      ctx.beginPath();   
      ctx.fillStyle = '#FF0000'
      ctx.fillText(text, x, y);
      ctx.rect(x, y, width, height); 
      ctx.stroke();
    });
  }



const MegatonCamera = ({width, height}) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const videoConstraints = {
      width: 480,
      height: 360,
      facingMode: "user"
    };

    const runCoco = async () => {
        const net = await cocossd.load();
        console.log("Handpose model loaded.");
        //  Loop and detect hands
        setInterval(() => {
            detect(net);
        }, 10);
    };

    const detect = async (net) => {
        // Check data is available
        if (
          typeof webcamRef.current !== "undefined" &&
          webcamRef.current !== null &&
          webcamRef.current.video.readyState === 4
        ) {
          // Get Video Properties
          const video = webcamRef.current.video;
          const videoWidth = webcamRef.current.video.videoWidth;
          const videoHeight = webcamRef.current.video.videoHeight;
    
          // Set video width
        //   webcamRef.current.video.width = videoWidth;
        //   webcamRef.current.video.height = videoHeight;
    
          // Set canvas height and width
          canvasRef.current.width = videoConstraints.width;
          canvasRef.current.height = videoConstraints.height;

          console.log(video);
    
          // Make Detections
          const obj = await net.detect(video);
    
          // Draw mesh
          const ctx = canvasRef.current.getContext("2d");
          drawRect(obj, ctx);
          // console.log(obj); 
          setDetectedObjects(obj);
          setNumberOfObject(obj.length);
        }
      };


    useEffect(()=>{runCoco()},[]);

    

    return <div style={{ position: "relative", background: '#4C97FF', width: width, height: height }}>
        <Webcam
        ref={webcamRef}
        style={{padding: '0px', height: '100%', width: '100%'}}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
    >
        </Webcam>
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: '100%',
            height: '100%',
          }}
        />
    </div>
}

export default MegatonCamera;