
import { useEffect, useRef, useState } from "react";

export const  Receiver = ()=>{
    const videoRef=useRef<HTMLVideoElement>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    let pc : RTCPeerConnection | null = null;
    useEffect(()=>{
        const socket=new WebSocket('ws://localhost:8080');
        setSocket(socket);
        socket.onopen=()=>{
            socket.send(JSON.stringify({type:'receiver'}));
        }
        socket.onmessage=async (event)=>{
            const message=JSON.parse(event.data);
           
            if(message.type==='createOffer'){
                pc=new RTCPeerConnection();
                pc.onicecandidate=(event)=>{
                    if(event.candidate){
                        socket?.send(JSON.stringify({type:'iceCandidate',candidate:event.candidate}));
                    }
                }
                pc.ontrack=(event)=>{
                    console.log(event);
                    if(videoRef.current){
                        videoRef.current.srcObject=new  MediaStream([event.track]);
                        videoRef.current.play(); 
                    }
                }
                await pc.setRemoteDescription(message.sdp);
                const answer=await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.send(JSON.stringify({type:'createAnswer',sdp:pc.localDescription}));
            }
            else if(message.type==='iceCandidate' && pc){
                try {
                    await pc.addIceCandidate(message.candidate);
                } catch (error) {
                    console.error('Error adding received ice candidate', error);
                }
            }
        }
    },[]);

    return(
        <div>
            Receiver
            <video ref={videoRef} autoPlay></video>
        </div>
    )
}