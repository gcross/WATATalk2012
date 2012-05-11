// Functions {{{
function hireAndFlashIn(time_to_enter,time_between_starts) { // {{{
    animations = []
    var current_wait_time = 0
    for(var i = 2; i < arguments.length; ++i) {
        animations.push(sequence(
            wait(current_wait_time),
            hireAndFadeIn(time_to_enter,arguments[i])
        ))
        current_wait_time += time_between_starts
    }
    return parallel.apply(null,animations)
} // }}}
function makePartFocusActor(name,labels) { return function() { // {{{
    var actor = new UseActor(name)

    var nodes = {}
    labels.forEach(function(label) {
        nodes[label] = document.getElementById(name + "." + label)
        if(!nodes[label]) throw Error("unable to find an node with id '" + name + "." + label + "'")
        actor[label + ".opacity"] = 0
    })
    actor.nodes = nodes

    actor.non_focused_opacity = 1

    appendToMethod(actor,"update",function() {
        labels.forEach(function(label) {
            nodes[label].setAttribute("opacity",Math.max(
                actor.non_focused_opacity,
                actor[label + ".opacity"]
            ))
        })
    })

    return actor
}} // }}}
// }}}

// Actors {{{
function makeDivergenceCurveActor() { return function() { // {{{
    actor = new UseActor("divergence.curve")
    actor.curviness = 0
    node = document.getElementById("divergence.curve")
    appendToMethod(actor,"update",function() {
        var c1 =  246.30331*this.curviness + 156.147
        var c2 = -256.25647*this.curviness + 926.05439
        var c3 =  340.59469*this.curviness + 310.72831
        node.setAttribute("d","M 156.147,651.323 C " + c1 + ",651.323 " + c2 + "," + c3 + " 926.05439,310.72831")
    })
    return actor
}} // }}}
function makeDivergingAutomataActor() { return function() { // {{{
    actor = makePartFocusActor("diverging_automata.automata",[
        "final_weights.1",
        "final_weights.2",
        "state.1",
        "state.2",
        "transitions",
        "transitions.initial",
    ])()
    actor["final_weights.1.opacity_override"] = 1
    actor["final_weights.2.opacity_override"] = 1
    appendToMethod(actor,"update",function() {
        for(i = 1; i <= 2; ++i) {
            label = "final_weights." + i
            node = actor.nodes[label]
            node.setAttribute("opacity",actor[label + ".opacity_override"]*node.getAttribute("opacity"))
        }
    })
    return actor
}} // }}}
// }}} Actors

// Title Management {{{
var current_title_index = -1

function nextTitleIndex() { // {{{
    current_title_index += 1
    return current_title_index
} // }}}
function rotateNextTitle() { // {{{
    return rotateTitle(nextTitleIndex())
} // }}}
function rotateTitle(index) { // {{{
    return sequence(
        parallel(
            accelerate(0.25,titles[index-1],"y",-50),
            fadeOutAndFire(0.25,titles[index-1])
        ),
        hireUseActor(titles[index]),
        set(titles[index],"y",-50),
        parallel(
            decelerate(0.25,titles[index],"y",0),
            fadeIn(0.25,titles[index])
        )
    )
} // }}}
// }}}
var titles = [ // Titles {{{
    "Divergence",
    "Diverging Automata",
    "Infinite Languages",
    "Diverging Languages",
    "Rational Operations",
    "Kleene's Theorem for Diverging Languages",
] // }}} Titles

window.addEventListener("load",function() {
    // Initialization {{{
    (function() {
        var resources = document.getElementById("resources")
        var title_template = document.getElementById("title_template")
        for(var i = 0; i < titles.length; ++i) {
            var title = titles[i]
            var node = title_template.cloneNode(false)
            node.setAttribute("id",title)
            node.appendChild(document.createTextNode(title))
            resources.appendChild(node)
        }
    })()
    // }}} Initialization

    initializeSlick([].concat([
// Script {{{
    // Title {{{
        hire("title_slide"),
        "",
        fadeOutAndFire(1,"title_slide"),
        hireAndFadeInUseActors(0.5,
            "standard_backdrop",
            titles[nextTitleIndex()]
        ),
    // }}} Title
    // Divergence {{{
        hireAndFadeIn(0.5,"divergence.question"),
        "",
        hireUseActor("divergence.divergence.cover","divergence.question"),
        hireUseActor("divergence.divergence","divergence.divergence.cover"),
        linear(0.5,"divergence.divergence.cover","x",220),
        fire("divergence.divergence.cover"),
        "",
        hireAndFadeIn(0.5,"divergence.escape"),
        "",
        hireAndFadeIn(0.5,"divergence.embrace"),
        "",
        fadeOutAndFire(0.5,
            "divergence.question",
            "divergence.divergence",
            "divergence.escape",
            "divergence.embrace"
        ),
        hireAndFadeIn(0.5,"divergence.backdrop"),
        "",
        hireUseActor("divergence.cover","divergence.backdrop"),
        hireUseActor("divergence.infinity","divergence.cover"),
        hire("divergence.curve",makeDivergenceCurveActor(),"divergence.cover"),
        linear(0.5,"divergence.cover","x",800),
        fire("divergence.cover"),
        "",
        linear(0.5,"divergence.curve","curviness",1),
        "",
        hireAndFadeIn(0.5,"divergence.function"),
        "",
        fadeOutAndFire(0.5,
            "divergence.backdrop",
            "divergence.curve",
            "divergence.infinity",
            "divergence.function"
        ),
    // }}}
    // Diverging automata {{{
        rotateNextTitle(),
      // Introduce the automata {{{
        hireUseActors("diverging_automata.5tuple","diverging_automata.5tuple.cover"),
        linear(0.5,"diverging_automata.5tuple.cover","x",470),
        hireAndFlashIn(0.5,0.25,
            "diverging_automata.5tuple.alphabet",
            "diverging_automata.5tuple.states",
            "diverging_automata.5tuple.transitions",
            "diverging_automata.5tuple.initial",
            "diverging_automata.5tuple.final"
        ),
        "",
        hire("diverging_automata.automata",makeDivergingAutomataActor()),
        parallel(
            decelerate(1,"diverging_automata.automata","x",520,0),
            hireAndFadeInUseActor(1,"diverging_automata.automata.box")
        ),
        "",
        parallel(
            linear(0.5,styleFor("diverging_automata.5tuple.states"),"opacity",0.33),
            linear(0.5,styleFor("diverging_automata.5tuple.transitions"),"opacity",0.33),
            linear(0.5,styleFor("diverging_automata.5tuple.initial"),"opacity",0.33),
            linear(0.5,styleFor("diverging_automata.5tuple.final"),"opacity",0.33),
            linear(0.5,"diverging_automata.automata","non_focused_opacity",0.33)
        ),
        "",
        parallel(
            linear(0.5,styleFor("diverging_automata.5tuple.alphabet"),"opacity",0.33),
            linear(0.5,styleFor("diverging_automata.5tuple.states"),"opacity",1),
            linear(0.5,"diverging_automata.automata","state.2.opacity",1),
            linear(0.5,"diverging_automata.automata","state.1.opacity",1)
        ),
        "",
        parallel(
            linear(0.5,styleFor("diverging_automata.5tuple.states"),"opacity",0.33),
            linear(0.5,styleFor("diverging_automata.5tuple.transitions"),"opacity",1),
            linear(0.5,"diverging_automata.automata","state.1.opacity",0.33),
            linear(0.5,"diverging_automata.automata","state.2.opacity",0.33),
            linear(0.5,"diverging_automata.automata","transitions.opacity",1)
        ),
        "",
        parallel(
            linear(0.5,styleFor("diverging_automata.5tuple.transitions"),"opacity",0.33),
            linear(0.5,styleFor("diverging_automata.5tuple.initial"),"opacity",1),
            linear(0.5,"diverging_automata.automata","transitions.opacity",0.33),
            linear(0.5,"diverging_automata.automata","state.1.opacity",1),
            linear(0.5,"diverging_automata.automata","transitions.initial.opacity",1)
        ),
        "",
        parallel(
            linear(0.5,styleFor("diverging_automata.5tuple.initial"),"opacity",0.33),
            linear(0.5,styleFor("diverging_automata.5tuple.final"),"opacity",1),
            linear(0.5,"diverging_automata.automata","transitions.initial.opacity",0.33),
            linear(0.5,"diverging_automata.automata","state.2.opacity",1),
            linear(0.5,"diverging_automata.automata","final_weights.1.opacity",1),
            linear(0.5,"diverging_automata.automata","final_weights.2.opacity",1)
        ),
        "",
        parallel(
            linear(0.5,"diverging_automata.automata","non_focused_opacity",1),
            linear(0.5,styleFor("diverging_automata.5tuple.alphabet"),"opacity",1),
            linear(0.5,styleFor("diverging_automata.5tuple.states"),"opacity",1),
            linear(0.5,styleFor("diverging_automata.5tuple.transitions"),"opacity",1),
            linear(0.5,styleFor("diverging_automata.5tuple.initial"),"opacity",1),
            linear(0.5,styleFor("diverging_automata.5tuple.final"),"opacity",1)
        ),
        set("diverging_automata.automata","state.1.opacity",0),
        set("diverging_automata.automata","state.2.opacity",0),
        set("diverging_automata.automata","final_weights.1.opacity",0),
        set("diverging_automata.automata","final_weights.2.opacity",0),
        "",
        hireAndFadeInUseActors(1,
            "diverging_automata.criterion.lhs",
            "diverging_automata.criterion.rhs"
        ),
        "",
        linear(0.5,styleFor("diverging_automata.criterion.rhs"),"opacity",0.33),
        "",
        parallel(
            linear(0.5,styleFor("diverging_automata.criterion.rhs"),"opacity",1),
            linear(0.5,styleFor("diverging_automata.criterion.lhs"),"opacity",0.33)
        ),
        "",
        linear(0.5,styleFor("diverging_automata.criterion.lhs"),"opacity",1),
        "",
      // }}}
      // First example {{{
        hireAndFlashIn(0.5,0.25,
            "diverging_automata.input.1.1",
            "diverging_automata.input.2.0",
            "diverging_automata.input.3.0",
            "diverging_automata.input.4plus"
        ),
        "",
        hireAndFadeIn(0.5,"diverging_automata.marker",null,"diverging_automata.automata"),
        smooth(0.5,"diverging_automata.marker","x",124.169),
        "",
        hireAndFadeIn(0.5,"diverging_automata.reader"),
        "",
        smooth(0.5,"diverging_automata.marker","x",336.694),
        "",
        smooth(0.5,"diverging_automata.reader","x",106),
        "",
        parallel(
            accelerate(0.5,"diverging_automata.reader","x",500),
            parallel(
                wait(0.5),
                set("diverging_automata.automata","state.2.opacity",1),
                linear(0.75,"diverging_automata.automata","non_focused_opacity",0.33)
            ),
            sequence(
                parallel(
                    accelerate(0.25,"diverging_automata.marker","x",444.128),
                    accelerate(0.25,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.25,"diverging_automata.marker","x",336.694),
                    decelerate(0.25,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.20,"diverging_automata.marker","x",444.128),
                    accelerate(0.20,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.20,"diverging_automata.marker","x",336.694),
                    decelerate(0.20,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.15,"diverging_automata.marker","x",444.128),
                    accelerate(0.15,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.15,"diverging_automata.marker","x",336.694),
                    decelerate(0.15,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",444.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",336.694),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",444.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",336.694),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",444.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",336.694),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",444.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",336.694),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",444.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",336.694),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                )
            )
        ),
        fire("diverging_automata.reader"),
        "",
        linear(0.5,"diverging_automata.automata","final_weights.2.opacity",1),
        "",
        parallel(
            linear(0.5,"diverging_automata.automata","non_focused_opacity",1),
            linear(0.5,"diverging_automata.automata","final_weights.1.opacity_override",0)
        ),
        set("diverging_automata.automata","state.2.opacity",0),
        "",
        smooth(0.5,"diverging_automata.marker","x",124.169),
        "",
        hireAndFadeInUseActors(0.5,
            "diverging_automata.weight.input.0",
            "diverging_automata.weight.mapsto"
        ),
        "",
        hireAndFadeIn(0.5,"diverging_automata.weight.1.0"),
        "",
        sequence(
            fadeOutAndFire(0.25,"diverging_automata.weight.input.0"),
            hireAndFadeIn(0.25,"diverging_automata.weight.input.1")
        ),
        fadeOutAndFire(0.5,"diverging_automata.weight.1.0"),
        "",
        hireAndFadeIn(0.5,"diverging_automata.reader"),
        "",
        parallel(
            smooth(0.5,"diverging_automata.marker","x",336.694),
            hireAndFadeIn(0.25,"diverging_automata.weight.1.1")
        ),
        "",
        set("diverging_automata.automata","final_weights.2.opacity",1),
        linear(0.5,"diverging_automata.automata","non_focused_opacity",0.33),
        "",
        hireAndFadeInUseActors(0.5,
                "diverging_automata.weight.equals",
                "diverging_automata.weight.result.1",
                "diverging_automata.weight.dot.3",
                "diverging_automata.weight.4.1"
        ),
        "",
        linear(0.5,"diverging_automata.automata","non_focused_opacity",1),
        set("diverging_automata.automata","final_weights.2.opacity",0),
        "",
        sequence(
            fadeOutAndFire(0.25,"diverging_automata.weight.input.1"),
            hireAndFadeIn(0.25,"diverging_automata.weight.input.2")
        ),
        "",
        smooth(0.5,"diverging_automata.reader","x",106),
        "",
        parallel(
            sequence(
                parallel(
                    accelerate(0.25,"diverging_automata.marker","x",444.128),
                    accelerate(0.25,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.25,"diverging_automata.marker","x",336.694),
                    decelerate(0.25,"diverging_automata.marker","y",0)
                )
            ),
            fadeOutAndFire(0.25,"diverging_automata.weight.result.1"),
            hireAndFadeInUseActors(0.5,
                "diverging_automata.weight.2.1_3",
                "diverging_automata.weight.dot.1",
                "diverging_automata.weight.result.1_3"
            )
        ),
        "",
        smooth(0.5,"diverging_automata.reader","x",212),
        "",
        parallel(
            sequence(
                parallel(
                    accelerate(0.25,"diverging_automata.marker","x",444.128),
                    accelerate(0.25,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.25,"diverging_automata.marker","x",336.694),
                    decelerate(0.25,"diverging_automata.marker","y",0)
                )
            ),
            fadeOutAndFire(0.25,"diverging_automata.weight.result.1_3"),
            hireAndFadeInUseActors(0.5,
                "diverging_automata.weight.3.1_3",
                "diverging_automata.weight.dot.2",
                "diverging_automata.weight.result.1_9"
            )
        ),
        "",
        sequence(
            fadeOutAndFire(0.25,"diverging_automata.weight.input.2"),
            hireAndFadeIn(0.25,"diverging_automata.weight.input.n")
        ),
        "",
        parallel(
            fadeOutAndFire(0.25,
                "diverging_automata.weight.1.1",
                "diverging_automata.weight.2.1_3",
                "diverging_automata.weight.dot.1",
                "diverging_automata.weight.3.1_3",
                "diverging_automata.weight.dot.2",
                "diverging_automata.weight.4.1",
                "diverging_automata.weight.dot.3",
                "diverging_automata.weight.result.1_9"
            ),
            hireAndFadeInUseActors(0.5,
                "diverging_automata.weight.result.1_3",
                "diverging_automata.weight.result.to_the_n"
            ),
            accelerate(0.5,"diverging_automata.reader","x",500)
        ),
        fire("diverging_automata.reader"),
        "",
      // }}}
      // Second example {{{
        fadeOutAndFire(0.25,"diverging_automata.input.1.1"),
        hireAndFadeIn(0.25,"diverging_automata.input.1.0"),
        "",
        parallel(
            fadeOutAndFire(0.5,
                "diverging_automata.weight.result.1_3",
                "diverging_automata.weight.result.to_the_n",
                "diverging_automata.weight.equals"
            ),
            linear(0.5,"diverging_automata.automata","final_weights.1.opacity_override",1)
        ),
        smooth(0.5,"diverging_automata.marker","x",124.169),
        "",
        hireAndFadeIn(0.5,"diverging_automata.reader"),
        parallel(
            accelerate(0.5,"diverging_automata.reader","x",500),
            parallel(
                wait(0.5),
                set("diverging_automata.automata","state.1.opacity",1),
                linear(0.75,"diverging_automata.automata","non_focused_opacity",0.33)
            ),
            sequence(
                parallel(
                    accelerate(0.25,"diverging_automata.marker","x",210.128),
                    accelerate(0.25,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.25,"diverging_automata.marker","x",124.169),
                    decelerate(0.25,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.20,"diverging_automata.marker","x",210.128),
                    accelerate(0.20,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.20,"diverging_automata.marker","x",124.169),
                    decelerate(0.20,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.15,"diverging_automata.marker","x",210.128),
                    accelerate(0.15,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.15,"diverging_automata.marker","x",124.169),
                    decelerate(0.15,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",210.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",124.169),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",210.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",124.169),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",210.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",124.169),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",210.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",124.169),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",210.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",124.169),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                )
            )
        ),
        fire("diverging_automata.reader"),
        "",
        linear(0.5,"diverging_automata.automata","final_weights.1.opacity",1),
        "",
        parallel(
            linear(0.5,"diverging_automata.automata","non_focused_opacity",1),
            linear(0.5,"diverging_automata.automata","final_weights.2.opacity_override",0)
        ),
        set("diverging_automata.automata","state.2.opacity",0),
        "",
        hireAndFadeIn(0.5,"diverging_automata.weight.1.0"),
        "",
      // }}}
      // Third example {{{
        parallel(
            sequence(
                fadeOutAndFire(0.25,"diverging_automata.input.1.0"),
                hireAndFadeIn(0.25,"diverging_automata.input.1.1")
            ),
            sequence(
                wait(0.25),
                fadeOutAndFire(0.25,"diverging_automata.input.2.0"),
                hireAndFadeIn(0.25,"diverging_automata.input.2.1")
            )
        ),
        parallel(
            fadeOutAndFire(0.5,
                "diverging_automata.weight.input.n",
                "diverging_automata.weight.mapsto",
                "diverging_automata.weight.1.0"
            ),
            linear(0.5,"diverging_automata.automata","final_weights.2.opacity_override",1)
        ),
        "",
        hireAndFadeIn(0.5,"diverging_automata.reader"),
        "",
        smooth(0.5,"diverging_automata.marker","x",336.694),
        "",
        smooth(0.5,"diverging_automata.reader","x",106),
        "",
        parallel(
            sequence(
                linear(0.025,"diverging_automata.automata","x",20),
                linear(0.05,"diverging_automata.automata","x",-20),
                linear(0.05,"diverging_automata.automata","x",20),
                linear(0.05,"diverging_automata.automata","x",-20),
                linear(0.025,"diverging_automata.automata","x",0)
            ),
            sequence(
                linear(0.025,"diverging_automata.automata","y",10),
                linear(0.05,"diverging_automata.automata","y",-10),
                linear(0.05,"diverging_automata.automata","y",10),
                linear(0.05,"diverging_automata.automata","y",-10),
                linear(0.05,"diverging_automata.automata","y",10),
                linear(0.05,"diverging_automata.automata","y",-10),
                linear(0.025,"diverging_automata.automata","y",0)
            )
        ),
        fadeOutAndFire(0.5,
            "diverging_automata.marker",
            "diverging_automata.reader"
        ),
        "",
        parallel(
            linear(0.5,"diverging_automata.automata","final_weights.1.opacity_override",0),
            linear(0.5,"diverging_automata.automata","final_weights.2.opacity_override",0)
        ),
        "",
        hireAndFadeInUseActors(0.5,
            "diverging_automata.weight.input.1",
            "diverging_automata.weight.mapsto"
        ),
        "",
        hireAndFadeIn(0.5,"diverging_automata.marker",null,"diverging_automata.automata"),
        smooth(0.5,"diverging_automata.marker","x",124.169), 
        "",
        hireAndFadeIn(0.5,"diverging_automata.reader"),
        "",
        parallel(
            smooth(0.5,"diverging_automata.marker","x",336.694),
            hireAndFadeInUseActors(0.5,
                "diverging_automata.weight.1.1",
                "diverging_automata.weight.equals"
            )
        ),
        "",
        hireAndFadeInUseActors(0.5,
            "diverging_automata.weight.4.0",
            "diverging_automata.weight.dot.3",
            "diverging_automata.weight.result.0"
        ),
        "",
        smooth(0.5,"diverging_automata.reader","x",106),
        parallel(
            sequence(
                linear(0.025,"diverging_automata.automata","x",20),
                linear(0.05,"diverging_automata.automata","x",-20),
                linear(0.05,"diverging_automata.automata","x",20),
                linear(0.05,"diverging_automata.automata","x",-20),
                linear(0.025,"diverging_automata.automata","x",0)
            ),
            sequence(
                linear(0.025,"diverging_automata.automata","y",10),
                linear(0.05,"diverging_automata.automata","y",-10),
                linear(0.05,"diverging_automata.automata","y",10),
                linear(0.05,"diverging_automata.automata","y",-10),
                linear(0.05,"diverging_automata.automata","y",10),
                linear(0.05,"diverging_automata.automata","y",-10),
                linear(0.025,"diverging_automata.automata","y",0)
            )
        ),
        fadeOutAndFire(0.5,
            "diverging_automata.marker",
            "diverging_automata.reader"
        ),
        "",
        fadeOutAndFire(0.25,
            "diverging_automata.weight.input.1",
            "diverging_automata.weight.1.1",
            "diverging_automata.weight.4.0",
            "diverging_automata.weight.dot.3",
            "diverging_automata.weight.equals",
            "diverging_automata.weight.result.0"
        ),
        hireAndFadeInUseActors(0.25,
            "diverging_automata.weight.input.n",
            "diverging_automata.weight.1.0"
        ),
        "",
      // }}}
        fadeOutAndFire(0.25,
            "diverging_automata.5tuple",
            "diverging_automata.5tuple.cover",
            "diverging_automata.5tuple.alphabet",
            "diverging_automata.5tuple.states",
            "diverging_automata.5tuple.transitions",
            "diverging_automata.5tuple.initial",
            "diverging_automata.5tuple.final",
            "diverging_automata.criterion.lhs",
            "diverging_automata.criterion.rhs",
            "diverging_automata.automata",
            "diverging_automata.automata.box",
            "diverging_automata.weight.input.n",
            "diverging_automata.weight.mapsto",
            "diverging_automata.weight.1.0",
            "diverging_automata.input.1.1",
            "diverging_automata.input.2.1",
            "diverging_automata.input.3.0",
            "diverging_automata.input.4plus"
        ),
    // }}}
    // Infinite languages {{{
        rotateNextTitle(),
        hireAndFadeInUseActor(0.5,"infinite_languages.borderlines"),
        "",
        hireAndFadeInUseActor(0.5,"infinite_languages.alphabet"),
        "",
        hireAndFadeInUseActor(0.5,"infinite_languages.alphabet.example"),
        "",
        hireAndFadeInUseActor(0.5,"infinite_languages.words.finite"),
        "",
        hireAndFlashIn(0.5,0.25,
            "infinite_languages.words.finite.examples.1",
            "infinite_languages.words.finite.examples.2"
        ),
        "",
        hireAndFadeInUseActor(0.5,"infinite_languages.words.infinite"),
        "",
        hireAndFlashIn(0.5,0.25,
            "infinite_languages.words.infinite.examples.1",
            "infinite_languages.words.infinite.examples.2"
        ),
        "",
        hireAndFadeInUseActor(0.5,"infinite_languages.words.nfinite"),
        "",
        hireAndFlashIn(0.5,0.25,
            "infinite_languages.words.nfinite.examples.1",
            "infinite_languages.words.nfinite.examples.2"
        ),
        "",
        fadeOutAndFire(0.5,
            "infinite_languages.borderlines",
            "infinite_languages.alphabet",
            "infinite_languages.alphabet.example",
            "infinite_languages.words.finite",
            "infinite_languages.words.finite.examples.1",
            "infinite_languages.words.finite.examples.2",
            "infinite_languages.words.infinite",
            "infinite_languages.words.infinite.examples.1",
            "infinite_languages.words.infinite.examples.2",
            "infinite_languages.words.nfinite",
            "infinite_languages.words.nfinite.examples.1",
            "infinite_languages.words.nfinite.examples.2"
        ),

// }}}
    // Diverging languages {{{
        rotateNextTitle(),
        hireAndFadeIn(0.5,"diverging_languages.borderlines"),
        "",
        hireAndFadeIn(0.5,"diverging_languages.alphabet"),
        "",
        hireAndFadeIn(0.5,"diverging_languages.semiring"),
        "",
        hireAndFadeIn(0.5,"diverging_languages.words.finite"),
        "",
        hireAndFadeIn(0.5,"diverging_languages.words.infinite"),
        "",
        hireAndFadeIn(0.5,"diverging_languages.language"),
        "",
        fadeOutAndFire(0.5,
            "diverging_languages.borderlines",
            "diverging_languages.alphabet",
            "diverging_languages.semiring",
            "diverging_languages.words.finite",
            "diverging_languages.words.infinite",
            "diverging_languages.language"
        ),
    // }}}
    // Rational diverging operations {{{
        rotateNextTitle(),
        hireAndFlashIn(0.5,0.25,
            "diverging_rational_operations_box_1",
            "diverging_rational_operations_box_2",
            "diverging_rational_operations_box_3",
            "diverging_rational_operations_box_4"
        ),
        "",
        hireAndFadeInUseActor(0.5, "diverging_rational_operations_precondition_1"),
        "",
        hireAndFadeInUseActor(0.5, "diverging_rational_operations_definition_1"),
        "",
        hireAndFadeInUseActor(0.5, "diverging_rational_operations_precondition_2"),
        "",
        hireAndFadeInUseActor(0.5, "diverging_rational_operations_definition_2"),
        "",
        hireAndFadeInUseActor(0.5, "diverging_rational_operations_precondition_3"),
        "",
        hireAndFadeInUseActor(0.5, "diverging_rational_operations_definition_3"),
        "",
        hireAndFadeInUseActor(0.5, "diverging_rational_operations_precondition_4"),
        "",
        hireAndFadeInUseActor(0.5, "diverging_rational_operations_definition_4"),
        "",
        hireAndFadeInUseActor(0.5, "diverging_rational_operations_definition_5"),
        "",
        fadeOutAndFire(0.5,
            "diverging_rational_operations_box_1",
            "diverging_rational_operations_box_2",
            "diverging_rational_operations_box_3",
            "diverging_rational_operations_box_4",
            "diverging_rational_operations_precondition_1",
            "diverging_rational_operations_precondition_2",
            "diverging_rational_operations_precondition_3",
            "diverging_rational_operations_precondition_4",
            "diverging_rational_operations_definition_1",
            "diverging_rational_operations_definition_3",
            "diverging_rational_operations_definition_4"
        ),
        parallel(
            smooth(0.5,"diverging_rational_operations_definition_5","y",-450.0),
            smooth(0.5,"diverging_rational_operations_definition_2","y",-180.0)
        ),
        "",
        hireAndFadeInUseActor(0.5,"diverging_rational_operations_definition_6"),
        "",
        hireAndFadeInUseActors(0.5,
            "diverging_rational_operations_example_box",
            "diverging_rational_operations_example_input_frame",
            "diverging_rational_operations_example_input_1",
            "diverging_rational_operations_example_input_2",
            "diverging_rational_operations_example_input_3"
        ),
        "",
        hireAndFlashIn(0.5,0.25,
            "diverging_rational_operations_example_letter_1",
            "diverging_rational_operations_example_letter_2",
            "diverging_rational_operations_example_letter_3",
            "diverging_rational_operations_example_letter_4",
            "diverging_rational_operations_example_letter_mapsto",
            "diverging_rational_operations_example_output_box"
        ),
        "",
        hireAndFadeInUseActors(0.5,
            "diverging_rational_operations_example_letter_pointer",
            "diverging_rational_operations_example_output_0_mapsto"
        ),
        "",
        hireAndFadeIn(0.5,"diverging_rational_operations_example_output_0_mapsto_0"),
        "",
        parallel(
            smooth(0.5,"diverging_rational_operations_example_letter_pointer","x",28),
            hireAndFadeIn(0.5,"diverging_rational_operations_example_output_1_mapsto")
        ),
        "",
        parallel(
            linear(0.5,styleFor("diverging_rational_operations_example_input_2"),"opacity",0.25),
            linear(0.5,styleFor("diverging_rational_operations_example_input_3"),"opacity",0.25)
        ),
        "",
        hireAndFadeIn(0.5,"diverging_rational_operations_example_output_1_mapsto_1_2"),
        "",
        parallel(
            linear(0.5,styleFor("diverging_rational_operations_example_input_2"),"opacity",1),
            linear(0.5,styleFor("diverging_rational_operations_example_input_3"),"opacity",1)
        ),
        "",
        parallel(
            smooth(0.5,"diverging_rational_operations_example_letter_pointer","x",52),
            hireAndFadeIn(0.5,"diverging_rational_operations_example_output_2_mapsto")
        ),
        "",
        parallel(
            linear(0.5,styleFor("diverging_rational_operations_example_input_1"),"opacity",0.25),
            linear(0.5,styleFor("diverging_rational_operations_example_input_2"),"opacity",0.25),
            linear(0.5,styleFor("diverging_rational_operations_example_input_3"),"opacity",0.25)
        ),
        "",
        linear(0.5,styleFor("diverging_rational_operations_example_input_1"),"opacity",1),
        "",
        parallel(
            linear(0.5,styleFor("diverging_rational_operations_example_input_1"),"opacity",0.25),
            linear(0.5,styleFor("diverging_rational_operations_example_input_2"),"opacity",1)
        ),
        "",
        hireAndFadeIn(0.5,"diverging_rational_operations_example_output_2_mapsto_5_4"),
        "",
        parallel(
            linear(0.5,styleFor("diverging_rational_operations_example_input_1"),"opacity",1),
            linear(0.5,styleFor("diverging_rational_operations_example_input_3"),"opacity",1)
        ),
        "",
        parallel(
            smooth(0.5,"diverging_rational_operations_example_letter_pointer","x",76),
            hireAndFadeIn(0.5,"diverging_rational_operations_example_output_3_mapsto")
        ),
        "",
        hireAndFadeIn(0.5,"diverging_rational_operations_example_output_3_mapsto_0"),
        "",
        parallel(
            smooth(0.5,"diverging_rational_operations_example_letter_pointer","x",100),
            hireAndFadeIn(0.5,"diverging_rational_operations_example_output_4_mapsto")
        ),
        "",
        hireAndFadeIn(0.5,"diverging_rational_operations_example_output_4_mapsto_5_2"),
        "",
        hireAndFadeIn(0.5,"diverging_rational_operations_example_output_dots"),
        "",
        hireAndFadeIn(0.5,"diverging_rational_operations_identity"),
        "",
        hireAndFadeIn(0.5,"diverging_rational_language_definition"),
        "",
        fadeOutAndFire(0.5,
            "diverging_rational_operations_definition_2",
            "diverging_rational_operations_definition_5",
            "diverging_rational_operations_definition_6",
            "diverging_rational_operations_example_box",
            "diverging_rational_operations_example_input_frame",
            "diverging_rational_operations_example_input_1",
            "diverging_rational_operations_example_input_2",
            "diverging_rational_operations_example_input_3",
            "diverging_rational_operations_example_letter_1",
            "diverging_rational_operations_example_letter_2",
            "diverging_rational_operations_example_letter_3",
            "diverging_rational_operations_example_letter_4",
            "diverging_rational_operations_example_letter_mapsto",
            "diverging_rational_operations_example_output_box",
            "diverging_rational_operations_example_letter_pointer",
            "diverging_rational_operations_example_output_0_mapsto",
            "diverging_rational_operations_example_output_0_mapsto_0",
            "diverging_rational_operations_example_output_1_mapsto",
            "diverging_rational_operations_example_output_1_mapsto_1_2",
            "diverging_rational_operations_example_output_2_mapsto",
            "diverging_rational_operations_example_output_2_mapsto_5_4",
            "diverging_rational_operations_example_output_3_mapsto",
            "diverging_rational_operations_example_output_3_mapsto_0",
            "diverging_rational_operations_example_output_4_mapsto",
            "diverging_rational_operations_example_output_4_mapsto_5_2",
            "diverging_rational_operations_example_output_dots",
            "diverging_rational_operations_identity",
            "diverging_rational_language_definition"
        ),
    // }}}
    // Kleene's Theorem {{{
        rotateNextTitle(),
        hireAndFlashIn(0.75,0.375,
            "diverging_kleene1",
            "diverging_kleene2",
            "diverging_kleene3"
        ),
        "",
        fadeOutAndFire(0.5,
            "diverging_kleene1",
            "diverging_kleene2",
            "diverging_kleene3"
        ),
    // }}}
// }}} Script
    ]))
},false)
