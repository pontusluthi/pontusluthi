import Head from "next/head";
import * as Matter from "matter-js";
import { Component } from "react";
import React from "react";
import styles from "../styles/Home.module.css";

const FORCE_MULT = 0.003;
const RADIUS = 350;
const MOUSE_DISTANCE = 130;
const MAX_MOUSE_DISTANCE = Math.floor(
  Math.sqrt(MOUSE_DISTANCE ** 2 + MOUSE_DISTANCE ** 2)
);
const MOUSE_FORCE = 0.00004;
const LUMP_FORCE = 0.005;

class Home extends Component {
  componentDidMount() {
    var Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Composite = Matter.Composite,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Events = Matter.Events,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

    var engine = Engine.create(),
      world = engine.world;

    engine.gravity.scale = 0;

    var render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        showVelocity: false,
        wireframes: false,
        background: "rgb(40, 70, 80)",
      },
    });

    for (let i = 0; i < 55; i++) {
      Composite.add(
        world,
        Bodies.circle(
          getRandomInt(0, window.innerWidth),
          getRandomInt(0, window.innerHeight),
          30,
          { frictionAir: 0.1 }
        )
      );
    }

    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: window.innerWidth, y: window.innerHeight },
    });

    render.bounds.min.x = 0;
    render.bounds.min.y = 0;

    window.addEventListener("resize", () => {
      render.bounds.max.x = window.innerWidth;
      render.bounds.max.y = window.innerHeight;
      render.options.width = window.innerWidth;
      render.options.height = window.innerHeight;
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;

      Matter.Body.setPosition(ground, { x: 0, y: window.innerHeight + 25 });
      Matter.Body.setPosition(wallRight, { x: window.innerWidth + 25, y: 0 });
    });

    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

    render.mouse = mouse;

    Events.on(engine, "afterUpdate", function () {
      for (let i = 0; i < Composite.allBodies(engine.world).length; i++) {
        let body = Composite.allBodies(engine.world)[i];

        body.render.fillStyle = "rgb(100, 100, 100";

        Body.applyForce(
          body,
          { x: body.position.x, y: body.position.y },
          vectorFieldCircle(body.position)
        );
        let mDiff = Math.floor(
          Math.sqrt(
            (body.position.x - mouse.position.x) ** 2 +
              (body.position.y - mouse.position.y) ** 2
          )
        );

        if (mDiff < MAX_MOUSE_DISTANCE) {
          Body.applyForce(
            body,
            { x: mouse.position.x, y: mouse.position.y },
            {
              x: (body.position.x - mouse.position.x) * MOUSE_FORCE,
              y: (body.position.y - mouse.position.y) * MOUSE_FORCE,
            }
          );
          body.render.fillStyle = "rgb(".concat(
            100 + MAX_MOUSE_DISTANCE - mDiff,
            ", ",
            100 + 1.8 * (MAX_MOUSE_DISTANCE - mDiff),
            ", ",
            100 + 2 * (MAX_MOUSE_DISTANCE - mDiff),
            ")"
          );
        }
      }
    });

    Render.run(render);
    var runner = Runner.create();
    Runner.run(runner, engine);
  }

  simDivObj = React.createRef();

  render() {
    return (
      <div className={styles.body}>
        <Head>
          <title>Pontus Lüthi</title>
        </Head>
        <div ref={this.simDivObj} className={styles.canvas} />

        <div className={styles.name}>
          <h1>Pontus Lüthi</h1>
        </div>
      </div>
    );
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function vectorFieldCircle({ x, y }) {
  x = (x - window.innerWidth / 2) / RADIUS;
  y = (y - window.innerHeight / 2) / RADIUS;
  return {
    x: (x - y - x * (x ** 2 + y ** 2)) * FORCE_MULT,
    y: (x + y - y * (x ** 2 + y ** 2)) * FORCE_MULT,
  };
}

function vectorFieldLump({ x, y }) {
  x = x - window.innerWidth / 2;
  y = y - window.innerHeight / 2;

  return {
    x: -x * FORCE_MULT * LUMP_FORCE,
    y: -y * FORCE_MULT * LUMP_FORCE,
  };
}

export default Home;
