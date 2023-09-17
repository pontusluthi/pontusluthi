import Head from 'next/head';
import * as Matter from 'matter-js';
import { Component } from 'react';
import React from 'react';
import styles from '../styles/Home.module.css'

const FORCE_MULT = 0.001;
const RADIUS = 350;
const MOUSE_DISTANCE = 150;
const MOUSE_FORCE = 0.00006;

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
        showVelocity: false
      }
    });

    var ground = Bodies.rectangle(0, window.innerHeight + 25, window.innerWidth * 2, 50, {
      isStatic: true, label: "Ground"
    });

    var ceiling = Bodies.rectangle(0, -25, window.innerWidth * 2, 50, {
      isStatic: true, label: "Ceiling"
    });

    var wallLeft = Bodies.rectangle(-25, 0, 50, window.innerHeight * 2, {
      isStatic: true, label: "Wall Left"
    });

    var wallRight = Bodies.rectangle(window.innerWidth + 26, 0, 50, window.innerHeight * 2, {
      isStatic: true, label: "Wall Right"
    });


    Composite.add(world, [
      ground,
      ceiling,
      wallLeft,
      wallRight,
    ]);

    for(let i = 0; i < 100; i++) {
      Composite.add(
        world, 
        Bodies.circle(getRandomInt(0, window.innerWidth), 
        getRandomInt(0, window.innerHeight), 
        30, 
        { frictionAir: 0.1 }));
    }


    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: window.innerWidth, y: window.innerHeight }
    });

    window.addEventListener('resize', () => { 
      render.bounds.max.x = window.innerWidth;
      render.bounds.max.y = window.innerHeight;
      render.options.width = window.innerWidth;
      render.options.height = window.innerHeight;
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;

      Matter.Body.setPosition(ground, {x: 0, y: window.innerHeight + 25})
      Matter.Body.setPosition(wallRight, {x: window.innerWidth + 25, y: 0})
    });

    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      })

    render.mouse = mouse;

    Events.on(engine, "afterUpdate", function() {
      for (let i = 0; i < Composite.allBodies(engine.world).length; i++) {
        let body = Composite.allBodies(engine.world)[i];

        Body.applyForce(body, { x: body.position.x, y: body.position.y }, vectorField(body.position));
        if (Math.abs(body.position.x - mouse.position.x) < MOUSE_DISTANCE && Math.abs(body.position.y - mouse.position.y) < MOUSE_DISTANCE) {
          Body.applyForce(
            body, 
            { x: mouse.position.x, y: mouse.position.y }, 
            { x: ((body.position.x - mouse.position.x)) * MOUSE_FORCE, y: ((body.position.y - mouse.position.y)) * MOUSE_FORCE }
          );
        }
      }
    });

    Render.run(render);
    var runner = Runner.create();
    Runner.run(runner, engine); 
  }

  simDivObj = React.createRef();

  render () {
    return (
      <div className={styles.body}>
        <Head>
          <title>Pontus Lüthi</title>
        </Head>
        <div ref={this.simDivObj} className={styles.canvas}/>

        <div className={styles.name}>
          <h1>
            Pontus Lüthi
          </h1>
        </div>
      </div>
    );
  }
}


function getRandomInt(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function vectorField({x, y}) {
  x = (x - window.innerWidth/2) / RADIUS;
  y = (y - window.innerHeight/2) / RADIUS;
  return { 
    x: (x - y - x*(x**2 + y**2)) * FORCE_MULT, 
    y: (x + y - y*(x**2 + y**2)) * FORCE_MULT
  };
}

export default Home;