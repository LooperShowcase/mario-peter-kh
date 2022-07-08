kaboom({
    global: true,
    // rag 0 - 255  kaboom : 0-1 alpha = 0-1
    clearColor: [0, 0, 1, 1],
    debug: true,
    fullscreen: true,
    scale: 2,
});

loadRoot("./sprites/");
loadSprite("block", "ground.png");
loadSprite("elona", "elona.png");
loadSprite("mario", "mario.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("surprise", "surprise.png");
loadSprite("gomba", "evil_mushroom.png");
loadSprite("coin", "coin.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("castle", "castle.png")
loadSound("gameSound", "gameSound.mp3");
loadSound("jumpSound", "jumpSound.mp3");
loadSound("deathSound", "DeathSound.mp3");
loadSprite("pipe", "pipe_up.png");
scene('vacation', (score) => {
    add([
        text("geme over!!\nsee you in the other side", 32),
        origin("center"),
        pos(width() / 2, height() / 2),
        scale(0.2)
    ]);
    keyRelease("enter", () => {
        go("game")
    })

})
scene("begin", () => {
    add([
        text("Welcome to super mario bros\nprees Enter to START", 30),
        origin("center"),
        pos(width() / 2, height() / 2)
    ])
    keyRelease("enter", () => {
        go("game")
    })
})

scene("game", () => {
    play('gameSound')
    layers(["bg", "obj", "ui"], "objsurpries");



    const SymbolMap = {

        width: 20,
        height: 20,

        "=": [sprite("block"), solid(), scale(1.3)],
        "?": [sprite("surprise"), solid(), "surprise-coin",],
        "!": [sprite("surprise"), solid(), "surprise-mushroom"],
        "$": [sprite("coin"), body(), solid(), "coin"],
        "M": [sprite("mushroom"), body(), solid(), "mushroom"],
        "x": [sprite("unboxed"), solid()],
        "^": [sprite("gomba"), body(), solid(), "gomba"],
        "@": [sprite("pipe"), , solid(), "pipe"],
        "c": [sprite("castle"), "castle"]
    }

    const map = [
        '                                                                            ',
        '                                                                            ',
        '                                                                            ',
        '                                                                            ',
        '                                                                            ',
        '                                                                            ',
        '                                                                            ',
        '                                                                            ',
        '                                                                            ',
        '                                                                            ',
        '                                                                            ',
        '                                                                            ',
        '                                                                            ',
        '                                                                            ',
        '                                                                            ',
        '                                                                            ',
        '                                                                            ',
        '                                                                            ',
        '                                                                            ',
        '                                                                            ',
        '                                                                            ',
        '                                                                     c      ',
        '                    ===?= ?==    ?     !=?                                  ',
        '                 @                                         @                ',
        '                                            ^  ^   ^           ^            ',
        '============================================================================',
        '============================================================================',
        '============================================================================',
        '============================================================================',
    ]
    const jumpforce = 350;
    let gombaspeed = 20;
    let score = 0;
    const scorelable = add([
        text("Score:" + score),
        pos(50, 300),
        layer("ui"),
        {
            value: score
        }
    ])
    const player = add([
        sprite('mario'),
        solid(),
        pos(50, 0),
        body(),
        origin("bot"),
        big(jumpforce)
    ]);


    const gameLevel = addLevel(map, SymbolMap);



    const speed = 120;
    keyDown('right', () => {
        player.move(speed, 0);
    });



    keyDown('left', () => {
        if (player.pos.x > 20) {
            player.move(-speed, 0);
        }
    });
    keyDown('up', () => {
        if (player.grounded()) {
            player.jump(jumpforce);
            play('jumpSound')
            isjumping = true;
        }
    })
    player.on("headbump", (obj) => {
        if (obj.is("surprise-coin")) {
            gameLevel.spawn("$", obj.gridPos.sub(0, 1));
            destroy(obj);
            gameLevel.spawn("x", obj.gridPos);


        }
        if (obj.is("surprise-mushroom")) {
            gameLevel.spawn("M", obj.gridPos.sub(0, 1));
            destroy(obj);
            gameLevel.spawn("x", obj.gridPos);

        }
    })
    player.collides("coin", (x) => {
        destroy(x)
        scorelable.value += 1;
        scorelable.text = "Score: " + scorelable.value
    });
    player.collides("mushroom", (x) => {
        destroy(x); player.biggify(10)
        scorelable.value += 10;
        scorelable.text = "Score: " + scorelable.value
    });


    action("mushroom", (mush) => {
        mush.move(30.0)

    })
    action("coin", (coin) => {
        coin.move(30.0)
    })
    action("gomba", (gege) => {
        gege.move(-gombaspeed, 0)
    })
    player.collides("gomba", (x) => {
        if (isjumping) {
            destroy(x)
            scorelable.value += 1;
            scorelable.text = "Score: " + scorelable.value
        }
        else {
            if (player.isBig()) {
                player.smallify()
            }
            else {
                destroy(player)
                go("vacation", scorelable.value)
            }
            destroy(player)
            go("vacation", scorelable.value)
        }
    });

    player.action(() => {
        camPos(player.pos.x, 500);
        scorelable.pos.x = player.pos.x - 200;
        if (player.pos.x >= 1400)
            go('win', score)
        if (player.grounded()) {
            isjumping = false;
        }
        else {
            isjumping = true;

        }
        if (player.pos.y >= 1000) {
            go("vacation", scorelable.value)

        }


    });
    loop(8, () => {
        gombaspeed = gombaspeed * -1;
    });
});
scene('win', (score) => {
    add([
        text('You Win ' + score, 60),
        origin('center'),
        pos(width() / 2, height() / 2)
    ])
    add([sprite("elona")])
    origin('center');
});
start("begin");