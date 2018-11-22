window.onload = () => {
  var peer;
  var conn;
  const hostInput = document.getElementById("hostInput");
  const videoElement = document.getElementById("video");
  function joinButtonPressed() {
    peer = new Peer(null, { host: "/", port: 9000, path: "/api" });
    peer.on("open", function(id) {
      peerId = id;
      console.log("ID: " + id);
    });
    peer.on("error", function(err) {
      if (err.type === "unavailable-id") {
        alert("" + err);
        peer.reconnect();
      } else alert("" + err);
    });

    peer.on("open", function() {
      conn = peer.connect(
        hostInput.value,
        {
          reliable: true,
        }
      );
      conn.on("open", function() {
        console.log("Connected to: " + hostInput.value);
        joinedHost();
      });
      conn.on("error", function(err) {
        console.info(err);
      });
    });
    peer.on("call", function(call) {
      console.info("Got a call");
      console.info(call);
      call.answer(null); // Answer the call with an A/V stream.
      call.on("stream", function(remoteStream) {
        // Show stream in some video/canvas element.
        console.info(remoteStream);
        videoElement.srcObject = remoteStream;
        videoElement.play();
      });
    });
  }

  function joinedHost() {}

  document.getElementById("joinButton").onclick = joinButtonPressed;
};
