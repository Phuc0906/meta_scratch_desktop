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

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

const MegatonCamera = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

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

    

    return <div style={{ position: "relative" }}>
        <Webcam
        ref={webcamRef}
        style={{padding: '0px'}}
        audio={false}
        height={380}
        screenshotFormat="image/jpeg"
        width={580}
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
            width: 640,
            height: 480,
          }}
        />
    </div>
}

export default MegatonCamera;