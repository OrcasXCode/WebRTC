import { useEffect, useState } from "react"


export const Sender=()=>{

    const [socket,setSocket]=useState<WebSocket | null>(null);


    //making the connection with the websocket server
    useEffect(()=>{
        const socket=new WebSocket('ws://localhost:8080');
        setSocket(socket);
        socket.onopen=()=>{
            socket.send(JSON.stringify({type:'sender'}));
        }
    },[])


    const initialConnection = async ()=>{
        if(!socket){
            alert("Socket not found");
            return;
        }
        const pc=new RTCPeerConnection();
        pc.onnegotiationneeded=async()=>{
            const offer=await pc.createOffer();
            //this is the sdp this is what we will send to receiver
            await pc.setLocalDescription(offer);
            socket?.send(JSON.stringify({type:'createOffer',sdp:pc.localDescription}));
        }

        pc.onicecandidate=( event)=>{
            if(event.candidate){
                socket?.send(JSON.stringify({type:'iceCandidate',candidate:event.candidate}));
            }
        }
        socket.onmessage=(event)=>{
            const data=JSON.parse(event.data); 
            if(data.type==='createAnswer'){
                pc.setRemoteDescription(data.sdp);
            } 
            else if(data.type==='iceCandidate'){
                pc.addIceCandidate(data.candidate);
            }
        }

        const stream = await navigator.mediaDevices.getUserMedia({video:true,audio:false});
        //addTrack will triger the onnegotiaionneeded function and will update the sdp 
        pc.addTrack(stream.getVideoTracks()[0]);
    }
    return(
        <div>
            Sender
            <button onClick={initialConnection}>Send Data</button>
        </div>
    )
}