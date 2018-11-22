window.onload = () => {
  var peer;
  var conn;
  var status = document.getElementById("status");
  var videoContainer = document.getElementById("video");

  const initialize = () => {
    // Create own peer object with connection to shared PeerJS server
    peer = new Peer(null, { host: "/", port: 9000, path: "/api" });

    peer.on("open", function(id) {
      console.log("ID: " + id);
      document.getElementById("peerId").innerHTML = id;
    });
    peer.on("error", function(err) {
      if (err.type === "unavailable-id") {
        alert("" + err);
        peer.reconnect();
      } else alert("" + err);
    });
    peer.on("connection", function(c) {
      if (conn) {
        console.info(
          "We already have a peer connected, ignoring new connection."
        );
        return;
      }
      conn = c;
      console.info(c);
      status.innerHTML = `User ${c.peer} has connected`;
      userConnected(c.peer);
    });
  };

  const userConnected = peerId => {
    navigator.getUserMedia(
      { video: true },
      function(stream) {
        var call = peer.call(peerId, stream);
        console.info(stream);
        call.on("stream", function(remoteStream) {
          console.info(remoteStream);
          // Show stream in some video/canvas element.
        });
        call.on("error", function(err) {
          console.info(err);
        });
      },
      function(err) {
        console.log("Failed to get local stream");
      }
    );
  };

  initialize();
};
