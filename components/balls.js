import React, {Component, useState} from "react";
import * as Matter from "matter-js";


const FORCE_MULTI = 0.003;
const RADIUS = 350;
const MOUSE_DISTANCE = 130;
const MAX_MOUSE_DISTANCE = Math.floor(
    Math.sqrt(MOUSE_DISTANCE ** 2 + MOUSE_DISTANCE ** 2)
);
const MOUSE_FORCE = 0.00004;
const LUMP_FORCE = 0.005;

const circleField = ({x, y}) => {
    x = (x - window.innerWidth / 2) / RADIUS;
    y = (y - window.innerHeight / 2) / RADIUS;
    return {
        x: (x - y - x * (x ** 2 + y ** 2)) * FORCE_MULTI,
        y: (x + y - y * (x ** 2 + y ** 2)) * FORCE_MULTI,
    };
}

const lumpField = ({x, y}) => {
    x = x - window.innerWidth / 2;
    y = y - window.innerHeight / 2;

    return {
        x: -x * FORCE_MULTI * LUMP_FORCE,
        y: -y * FORCE_MULTI * LUMP_FORCE,
    };
}

const disperseField = ({x, y}) => {
    x = x - window.innerWidth / 2;
    y = y - window.innerHeight / 2;

    if ((x ** 2 + y ** 2) > (window.innerHeight/2) ** 2 + (window.innerWidth/2) ** 2) {
        return {x: 0, y: 0}
    }

    return {
        x: x * FORCE_MULTI * LUMP_FORCE * 2,
        y: y * FORCE_MULTI * LUMP_FORCE * 2,
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

        window.addEventListener("resize", () => {
            render.bounds.max.x = window.innerWidth;
            render.bounds.max.y = window.innerHeight;
            render.options.width = window.innerWidth;
            render.options.height = window.innerHeight;
            render.canvas.width = window.innerWidth;
            render.canvas.height = window.innerHeight;
        });

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

                body.render.fillStyle = "rgb(100, 100, 100";

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
                        (100 + (MAX_MOUSE_DISTANCE - mDiff)).toString(),
                        ", ",
                        (100 + 1.8 * (MAX_MOUSE_DISTANCE - mDiff)).toString(),
                        ", ",
                        (100 + 2 * (MAX_MOUSE_DISTANCE - mDiff)).toString(),
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