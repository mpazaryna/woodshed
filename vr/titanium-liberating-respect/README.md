# A Moving Light Component

Built with [A-Frame](https://aframe.io), a web framework for building virtual reality experiences. Make WebVR with HTML and Entity-Component. Works on Vive, Rift, desktop, mobile platforms.

Click and drag on desktop. Open it on a smartphone and use the device motion sensors. Or [plug in a VR headset](https://webvr.rocks)!

```
<a-entity
 id="lightSphere"
 geometry="primitive: sphere; radius: 0.2"
 material="shader: flat"
 light="type: point; color: #FFF"
 position="-4 3 -4"
 animation="property: position; to: 4 2.8 -4; dir: alternate; loop: true">
</a-entity>
```

In this case, the component that is being created is simply the light, with it's color and sizing.  
The animation is applied to the light (at this point) but, it's properties should be controlled by 
the counselor.  Those properties would include size, color, speed and with postion width.

