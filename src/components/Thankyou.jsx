import React from "react";

const Thankyou = ({ handleChageScreen }) => {
  React.useEffect(() => {
    const wrapper = document.getElementById("tk_wrapper");
    function getCanvas() {
      const c = document.getElementById("canvas");
      const ctx = c.getContext("2d");

      let cwidth, cheight;
      let shells = [];
      let pass = [];

      const colors = [
        "#FF5252",
        "#FF4081",
        "#E040FB",
        "#7C4DFF",
        "#536DFE",
        "#448AFF",
        "#40C4FF",
        "#18FFFF",
        "#64FFDA",
        "#69F0AE",
        "#B2FF59",
        "#EEFF41",
        "#FFFF00",
        "#FFD740",
        "#FFAB40",
        "#FF6E40",
      ];

      window.onresize = function () {
        reset();
      };
      reset();
      function reset() {
        cwidth = window.innerWidth;
        cheight = window.innerHeight;
        c.width = cwidth;
        c.height = cheight;
      }

      function newShell() {
        const left = Math.random() > 0.5;
        const shell = {};
        shell.x = 1 * left;
        shell.y = 1;
        shell.xoff = (0.01 + Math.random() * 0.007) * (left ? 1 : -1);
        shell.yoff = 0.01 + Math.random() * 0.007;
        shell.size = Math.random() * 6 + 3;
        shell.color = colors[Math.floor(Math.random() * colors.length)];

        shells.push(shell);
      }

      function newPass(shell) {
        const pasCount = Math.ceil(Math.pow(shell.size, 2) * Math.PI);

        for (let i = 0; i < pasCount; i++) {
          const pas = {};
          pas.x = shell.x * cwidth;
          pas.y = shell.y * cheight;

          const a = Math.random() * 4;
          const s = Math.random() * 6;

          pas.xoff = s * Math.sin((5 - a) * (Math.PI / 2));
          pas.yoff = s * Math.sin(a * (Math.PI / 2));

          pas.color = shell.color;
          pas.size = Math.sqrt(shell.size);

          if (pass.length < 1000) {
            pass.push(pas);
          }
        }
      }

      let lastRun = 0;
      Run();
      function Run() {
        let dt = 1;
        if (lastRun !== 0) {
          dt = Math.min(50, performance.now() - lastRun);
        }
        lastRun = performance.now();

        //ctx.clearRect(0, 0, cwidth, cheight);
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.fillRect(0, 0, cwidth, cheight);

        if (shells.length < 10 && Math.random() > 0.96) {
          newShell();
        }

        for (let ix in shells) {
          const shell = shells[ix];

          ctx.beginPath();
          ctx.arc(
            shell.x * cwidth,
            shell.y * cheight,
            shell.size,
            0,
            2 * Math.PI
          );
          ctx.fillStyle = shell.color;
          ctx.fill();

          shell.x -= shell.xoff;
          shell.y -= shell.yoff;
          shell.xoff -= shell.xoff * dt * 0.001;
          shell.yoff -= (shell.yoff + 0.2) * dt * 0.00005;

          if (shell.yoff < -0.005) {
            newPass(shell);
            shells.splice(ix, 1);
          }
        }

        for (let ix in pass) {
          const pas = pass[ix];

          ctx.beginPath();
          ctx.arc(pas.x, pas.y, pas.size, 0, 2 * Math.PI);
          ctx.fillStyle = pas.color;
          ctx.fill();

          pas.x -= pas.xoff;
          pas.y -= pas.yoff;
          pas.xoff -= pas.xoff * dt * 0.001;
          pas.yoff -= (pas.yoff + 5) * dt * 0.0005;
          pas.size -= dt * 0.002 * Math.random();

          if (pas.y > cheight || pas.y < -50 || pas.size <= 0) {
            pass.splice(ix, 1);
          }
        }
        requestAnimationFrame(Run);
      }
    }
    getCanvas();

    setTimeout(() => {
      window.location.reload();
      handleChageScreen("default");
    }, 6000);
    return () => {
      return;
    };
  }, []);
  return (
    <div
      id="tk_wrapper"
      className=" relative min-h-[80vh] w-full  z-[980] bg-black text-white text-center"
    >
      <canvas className="absolute inset-0 z-[-1] " id="canvas"></canvas>
      <div className="absolute top-[5vh] left-[5vh] px-5 py-2 rounded-md text-center bg-green-500 text-white font-semibold inline-block  hover:scale-125 transition-all cursor-pointer   ">
        <button
          className=""
          onClick={() => {
            handleChageScreen("default");
          }}
        >
          BACK
        </button>
      </div>
      <div className="absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center p-5 ">
        <h1 id="thanks">
          <strong>NAMPERFUME</strong>
        </h1>
        <h1 id="thanks" className="font-[700] ">
          THANK YOU !
        </h1>
      </div>
    </div>
  );
};

export default Thankyou;
