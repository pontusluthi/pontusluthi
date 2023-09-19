import React, {Component, useState} from "react";
import * as Matter from "matter-js";


let RADIUS = 350;
const FORCE_MULTI = 0.0013;

const MOUSE_DISTANCE = 130;
const MAX_MOUSE_DISTANCE = Math.floor(
    Math.sqrt(MOUSE_DISTANCE ** 2 + MOUSE_DISTANCE ** 2)
);
const MOUSE_FORCE = 0.000025;
const LUMP_FORCE = 0.005 * 0.0013;

const BASE_COLOR = "rgb(56, 134, 151)";
const BASE_RGB = {r: 56, g: 134, b: 151};

const circleField = ({x, y}) => {
    x = (x - window.innerWidth / 2) / RADIUS;
    y = (y - window.innerHeight / 2) / RADIUS;
    return {
        x: (x - y - x * (x ** 2 + y ** 2)) * FORCE_MULTI * RADIUS / 300,
        y: (x + y - y * (x ** 2 + y ** 2)) * FORCE_MULTI * RADIUS / 300,
    };
}

const lumpField = ({x, y}) => {
    x = x - window.innerWidth / 2;
    y = y - window.innerHeight / 2;

    return {
        x: -x * LUMP_FORCE,
        y: -y * LUMP_FORCE,
    };
}

const disperseField = ({x, y}) => {
    x = x - window.innerWidth / 2;
    y = y - window.innerHeight / 2;

    if ((x ** 2 + y ** 2) > (window.innerHeight/2) ** 2 + (window.innerWidth/2) ** 2) {
        return {x: 0, y: 0}
    }

    return {
        x: x * LUMP_FORCE * 2,
        y: y * LUMP_FORCE * 2,
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * max) + min;
}

const fieldType = {
    "circle": circleField,
    "lump": lumpField,
    "disperse": disperseField,
}

let currField = "";

class Balls extends Component {
    constructor(props) {
        super(props);
        currField = this.props.field;
    }

    componentDidMount() {
        RADIUS = (window.innerHeight - 300) / 2;
        this.create_balls();
    }

    create_balls = () => {
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Composite = Matter.Composite,
            Bodies = Matter.Bodies,
            Body = Matter.Body,
            Events = Matter.Events,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        const engine = Engine.create(),
            world = engine.world;

        engine.gravity.scale = 0;

        const render = Render.create({
            element: document.body,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                showVelocity: false,
                wireframes: false,
                background: "rgb(239, 111, 108)",
            },
        });

        for (let i = 0; i < 55; i++) {
            Composite.add(
                world,
                Bodies.circle(
                    getRandomInt(0, window.innerWidth),
                    getRandomInt(0, window.innerHeight),
                    20,
                    {frictionAir: 0.1}
                )
            );
        }

        Render.lookAt(render, {
            min: {x: 0, y: 0},
            max: {x: window.innerWidth, y: window.innerHeight},
        });

        render.bounds.min.x = 0;
        render.bounds.min.y = 0;


        window.onresize = () => {
            render.bounds.max.x = window.innerWidth;
            render.bounds.max.y = window.innerHeight;
            render.options.width = window.innerWidth;
            render.options.height = window.innerHeight;
            render.canvas.width = window.innerWidth;
            render.canvas.height = window.innerHeight;

            RADIUS = (window.innerHeight - 300) / 2;
        }

        const mouse = Mouse.create(render.canvas),
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

                body.render.fillStyle = BASE_COLOR;

                Body.applyForce(
                    body,
                    {x: body.position.x, y: body.position.y},
                    fieldType[currField](body.position)
                );
                let mDiff = Math.floor(
                    Math.sqrt(
                        (body.position.x - mouse.position.x) ** 2 +
                        (body.position.y - mouse.position.y) ** 2
                    )
                );

                let speed = Body.getSpeed(body);
                speed = speed * 15;

                body.render.fillStyle = "rgb(".concat(
                    (speed < BASE_RGB.r ? BASE_RGB.r : speed).toString(),
                    ", ",
                    (speed < BASE_RGB.g ? BASE_RGB.g : speed).toString(),
                    ", ",
                    (speed < BASE_RGB.b ? BASE_RGB.b : speed).toString(),
                    ")"
                );

                if (mDiff < MAX_MOUSE_DISTANCE) {
                    Body.applyForce(
                        body,
                        {x: mouse.position.x, y: mouse.position.y},
                        {
                            x: (body.position.x - mouse.position.x) * MOUSE_FORCE,
                            y: (body.position.y - mouse.position.y) * MOUSE_FORCE,
                        }
                    );
                    body.render.fillStyle = "rgb(".concat(
                        (BASE_RGB.r + (MAX_MOUSE_DISTANCE - mDiff)).toString(),
                        ", ",
                        (BASE_RGB.g + 1.8 * (MAX_MOUSE_DISTANCE - mDiff)).toString(),
                        ", ",
                        (BASE_RGB.b + 2 * (MAX_MOUSE_DISTANCE - mDiff)).toString(),
                        ")"
                    );
                }
            }
        });

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

    }

    simDivObj = React.createRef();

    render() {}
}

export default Balls;