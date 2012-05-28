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
function makePunchLineActor() { // Punch line slide {{{
    var actor = new UseActor("punch_line")
    actor.top_set_node = document.getElementById("punch_line_top_set")
    actor.equals_node = document.getElementById("punch_line_equals")
    actor.bottom_set_nodes = document.getElementsByClassName("punch_line_bottom_set")

    var labels = [
        "rational_power_series",
        "s_operator",
        "reverse_s_operator",
        "dot_operators",
        "sum_operator"
    ]

    var nodes = {}
    var opacities = {}
    labels = labels.map(function(label) {
        if(typeof label === "string") {
            node = document.getElementById("punch_line_" + label)
            if(!node)
                throw Error("unable to find a node with id '" + "punch_line_" + label + "'")
            nodes[label] = [node]
        } else {
            label = label[0]
            nodelist = document.getElementsByClassName("punch_line_" + label)
            if(nodelist.length = 0)
                throw Error("unable to find any nodes with class '" + "punch_line_" + label + "'")
            nodes[label] = Array(nodelist.length)
            for(var i = 0; i < nodelist.length; ++i) nodes[label][i] = nodelist[i];
        }
        actor[label + "_opacity"] = 0
        return label
    })
    actor.nodes = nodes
    actor.opacities = opacities

    actor.top_set_opacity = 0
    actor.equals_opacity = 0
    actor.bottom_set_opacity = 0

    actor.non_focused_opacity = 1

    appendToMethod(actor,"update",function() {
        actor.top_set_node.setAttribute("opacity",actor.top_set_opacity*actor.non_focused_opacity)
        actor.equals_node.setAttribute("opacity",actor.equals_opacity*actor.non_focused_opacity)
        for(var i = 0; i < actor.bottom_set_nodes.length; ++i)
            actor.bottom_set_nodes[i].setAttribute("opacity",actor.bottom_set_opacity*actor.non_focused_opacity);
        labels.forEach(function(label) {
            actor.nodes[label].forEach(function(node) { node.setAttribute("opacity",Math.max(
                node.getAttribute("opacity"),
                actor[label + "_opacity"]
            ))})
        })
    })

    return actor
} // }}}
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
    "Outline",
    "Motivation",
    "Outline",
    "Incorporating Weights into Infinite Languages",
    "Embrace Divergence!",
    "Infinite Languages",
    "Diverging Power Series",
    "Notational aside",
    "Rational Operations",
    "Diverging Automata",
    "Kleene's Theorem",
    "Bi-diverging Power Series",
    "Bi-diverging Automata",
    "Kleene's Theorem",
    "Outline",
    "Criteria for an Effective Ansatz",
    "Dual Automata",
    "Recipe for Computing Expectation Values",
    "Outline",
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
    // Outline {{{
        hireAndFlashIn(0.5,0.25,
            "outline.1",
            "outline.2",
            "outline.3"
        ),
        "",
        hireAndFadeIn(0.5,"outline.highlight"),
        "",
        fadeOutAndFire(0.5,
            "outline.highlight",
            "outline.1",
            "outline.2",
            "outline.3"
        ),
    // }}}
    // Infinite system {{{
        rotateNextTitle(),
        hireAndFadeIn(0.5,"is.particle.0"),
]).concat((function() {
    var animations = []
    for(var i = -9; i <= +9; ++i) {
        if(i != 0) {
            animations.push(hire("is.particle." + i))
            animations.push(set("is.particle." + i,"x",-i*80))
        }
    }
    return animations
})()).concat([
        "",
]).concat((function() {
    var animations = []
    for(var i = -9; i <= +9; ++i) {
        if(i != 0) {
            animations.push(decelerate(0.5,"is.particle." + i,"x",0))
        }
    }
    return parallel.apply(null,animations)
})()).concat([
        "",
]).concat((function() {
    var animations = []
    spins =
        ['down',
         'down',
         'up',
         'down',
         'up',
         'up',
         'up',
         'down',
         'up',
         'down',
         'down',
         'down',
         'down']
    for(var i = -6; i <= +6; ++i) {
        var id = "is.arrow." + i + "." + spins[i+6]
        animations.push(sequence(
            wait(Math.abs(i)*0.1),
            hireAndFadeIn(0.2,id)
        ))
    }
    return parallel.apply(null,animations)
})()).concat([
        "",
        hireAndFadeIn(0.5,"is.bulk"),
        "",
        hireAndFadeIn(0.5,"is.avagadro"),
        "",
        hireAndFadeIn(0.5,"is.negligible_boundary_effects"),
        "",
        fadeOutAndFire(0.5,
            "is.bulk",
            "is.avagadro",
            "is.negligible_boundary_effects"
        ),
        hireUseActor("is.proper_search","is.particle.0"),
        fadeIn(0.5,"is.proper_search",0),
        "",
        fadeOutAndFire(0.5,"is.proper_search"),
        "",
        parallel(
            hireAndFadeIn(0.5,"is.defn.1"),
            sequence(
                wait(0.25),
                hireAndFadeIn(0.5,"is.defn.2",makePartFocusActor("is.defn.2",["domain","range","misc"]))
            ),
            sequence(
                wait(0.5),
                hireAndFadeIn(0.5,"is.defn.3")
            )
        ),
        "",
        set("is.defn.2","domain.opacity",1),
        linear(0.5,"is.defn.2","non_focused_opacity",0.33),
        "",
        parallel(
            linear(0.5,"is.defn.2","domain.opacity",0),
            linear(0.5,"is.defn.2","range.opacity",1)
        ),
        "",
        linear(0.5,"is.defn.2","non_focused_opacity",1),
        set("is.defn.2","range.opacity",0),
        "",
]).concat((function() {
    var actor_names = [0.5]
    for(var i = 1; i <= 3; ++i) actor_names.push("is.defn." + i)
    for(var i = -6; i <= +6; ++i) actor_names.push("is.arrow." + i + "." + spins[i+6])
    for(var i = -9; i <= +9; ++i) actor_names.push("is.particle." + i)
    return fadeOutAndFire.apply(null,actor_names)
})()).concat([        
    // }}}
    // Outline {{{
        rotateNextTitle(),
        hireAndFadeInUseActors(0.5,
            "outline.highlight",
            "outline.1",
            "outline.2",
            "outline.3"
        ),
        "",
        smooth(0.5,"outline.highlight","y",160),
        "",
        fadeOutAndFire(0.5,
            "outline.highlight",
            "outline.1",
            "outline.2",
            "outline.3"
        ),
    // }}}
    // Divergence {{{
        rotateNextTitle(),
        "",
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
        rotateNextTitle(),
        hireAndFadeIn(0.5,"divergence.backdrop"),
        "",
        hireUseActor("divergence.cover","divergence.backdrop"),
        hireUseActor("divergence.infinity","divergence.cover"),
        hire("divergence.curve",makeDivergenceCurveActor(),"divergence.cover"),
        linear(0.5,"divergence.cover","x",800),
        fire("divergence.cover"),
        "",
        hireAndFadeIn(0.5,"divergence.function"),
        "",
        linear(0.5,"divergence.curve","curviness",1),
        "",
        fadeOutAndFire(0.5,
            "divergence.backdrop",
            "divergence.curve",
            "divergence.infinity",
            "divergence.function"
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
    // Notational aside {{{
        rotateNextTitle(),
        hireAndFlashIn(0.5,0.25,
            "notation.1",
            "notation.2",
            "notation.3"
        ),
        "",
        fadeOutAndFire(0.5,
            "notation.1",
            "notation.2",
            "notation.3"
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
            "diverging_rational_operations_definition_2",
            "diverging_rational_operations_definition_4"
        ),
        parallel(
            smooth(0.5,"diverging_rational_operations_definition_5","y",-450.0),
            smooth(0.5,"diverging_rational_operations_definition_3","y",-320.0)
        ),
        "",
        hireAndFadeInUseActor(0.5,"diverging_rational_operations_definition_6"),
        "",
        hireAndFadeIn(0.5,"diverging_rational_operations_identity"),
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
            "diverging_rational_operations_example_letter_5plus",
            "diverging_rational_operations_example_letter_mapsto",
            "diverging_rational_operations_example_output_box"
        ),
        "",
        hireAndFadeInUseActors(0.5,
            "diverging_rational_operations_example_letter_pointer_left",
            "diverging_rational_operations_example_output_0_mapsto"
        ),
        "",
        linear(0.5,styleFor("diverging_rational_operations_example_input_1"),"opacity",0.25),
        "",
        hireAndFadeIn(0.5,"diverging_rational_operations_example_output_0_mapsto_0"),
        "",
        linear(0.5,styleFor("diverging_rational_operations_example_input_1"),"opacity",1),
        "",
        hireUseActors(
            "diverging_rational_operations_example_letter_pointer",
            "diverging_rational_operations_example_letter_pointer_cover"
        ),
        moveToEnd("diverging_rational_operations_example_letter_pointer_left"),
        moveToEnd("diverging_rational_operations_example_box"),
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
        hireAndFadeIn(0.5,"diverging_rational_language_definition"),
        "",
        fadeOutAndFire(0.5,
            "diverging_rational_operations_definition_3",
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
            "diverging_rational_operations_example_letter_5plus",
            "diverging_rational_operations_example_letter_mapsto",
            "diverging_rational_operations_example_output_box",
            "diverging_rational_operations_example_letter_pointer",
            "diverging_rational_operations_example_letter_pointer_cover",
            "diverging_rational_operations_example_letter_pointer_left",
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
        hire("diverging_automata.automata",makeDivergingAutomataActor()),
        parallel(
            decelerate(1,"diverging_automata.automata","x",520,0),
            hireAndFadeInUseActor(1,"diverging_automata.automata.box")
        ),
        "",
        hireAndFadeIn(1,"diverging_automata.criterion"),
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
        parallel(
            sequence(
                hireAndFadeIn(0.5,"diverging_automata.marker",null,"diverging_automata.automata"),
                smooth(0.5,"diverging_automata.marker","x",124.169)
            ),
            hireAndFadeIn(0.5,"diverging_automata.reader")
        ),
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
        parallel(
            sequence(
                fadeOutAndFire(0.25,"diverging_automata.weight.input.0"),
                hireAndFadeIn(0.25,"diverging_automata.weight.input.1")
            ),
            fadeOutAndFire(0.5,"diverging_automata.weight.1.0"),
            hireAndFadeIn(0.5,"diverging_automata.reader")
        ),
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
        parallel(
            sequence(
                fadeOutAndFire(0.25,"diverging_automata.weight.input.1"),
                hireAndFadeIn(0.25,"diverging_automata.weight.input.2")
            ),
            smooth(0.5,"diverging_automata.reader","x",106)
        ),
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
        parallel(
            sequence(
                fadeOutAndFire(0.25,"diverging_automata.weight.input.2"),
                hireAndFadeIn(0.25,"diverging_automata.weight.input.3")
            ),
            smooth(0.5,"diverging_automata.reader","x",212)
        ),
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
        parallel(
            sequence(
                fadeOutAndFire(0.25,"diverging_automata.weight.input.3"),
                hireAndFadeIn(0.25,"diverging_automata.weight.input.n")
            ),
            accelerate(0.5,"diverging_automata.reader","x",500)
        ),
        fire("diverging_automata.reader"),
        parallel(
            fadeOutAndFire(0.25,
                "diverging_automata.weight.equals",
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
                "diverging_automata.weight.1.1_3",
                "diverging_automata.weight.result.to_the_n",
                "diverging_automata.weight.qualifier"
            )
        ),
        "",
    // }}}
    // Second example {{{
        fadeOutAndFire(0.25,"diverging_automata.input.1.1"),
        hireAndFadeIn(0.25,"diverging_automata.input.1.0"),
        "",
        parallel(
            fadeOutAndFire(0.5,
                "diverging_automata.weight.1.1_3",
                "diverging_automata.weight.result.to_the_n",
                "diverging_automata.weight.qualifier"
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
        hireAndFadeIn(0.5,"diverging_automata.marker",null,"diverging_automata.automata"),
        smooth(0.5,"diverging_automata.marker","x",124.169), 
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
            "diverging_automata.criterion",
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
    // Bi-diverging languages {{{
        rotateNextTitle(),
]).concat((function() {
    var animations = []
    for(var i = -9; i <= +9; ++i) {
        animations.push(hire("is.particle." + i))
        animations.push(set("is.particle." + i,"x",-i*80))
        animations.push(set("is.particle." + i,"y",160))
    }
    return animations
})()).concat([
        "",
]).concat((function() {
    var animations = []
    for(var i = 1; i <= +9; ++i) {
        animations.push(decelerate(0.5,"is.particle." + i,"x",0))
    }
    return parallel.apply(null,animations)
})()).concat([
        "",
]).concat((function() {
    var animations = []
    for(var i = -9; i <= -1; ++i) {
        animations.push(decelerate(0.5,"is.particle." + i,"x",0))
    }
    return parallel.apply(null,animations)
})()).concat([
        ""
]).concat((function() {
    var actor_names = [0.5]
    for(var i = -9; i <= +9; ++i) actor_names.push("is.particle." + i)
    return [fadeOutAndFire.apply(null,actor_names)]
})()).concat([
        hireAndFadeIn(0.5,"brl"),
        "",
        fadeOutAndFire(0.5,
            "brl"
        ),
    // }}}
    // Bi-diverging automata {{{
        rotateNextTitle(),
        hireUseActors("bidiverging_automata.5tuple","bidiverging_automata.5tuple.cover"),
        linear(0.5,"bidiverging_automata.5tuple.cover","x",470),
        hireAndFlashIn(0.5,0.25,
            "bidiverging_automata.5tuple.alphabet",
            "bidiverging_automata.5tuple.states",
            "bidiverging_automata.5tuple.transitions",
            "bidiverging_automata.5tuple.initial",
            "bidiverging_automata.5tuple.final"
        ),
        "",
        parallel(
            linear(0.5,styleFor("bidiverging_automata.5tuple.alphabet"),"opacity",0.25),
            linear(0.5,styleFor("bidiverging_automata.5tuple.states"),"opacity",0.25),
            linear(0.5,styleFor("bidiverging_automata.5tuple.transitions"),"opacity",0.25),
            linear(0.5,styleFor("bidiverging_automata.5tuple.final"),"opacity",0.25)
        ),
        "",
        parallel(
            linear(0.5,styleFor("bidiverging_automata.5tuple.alphabet"),"opacity",1),
            linear(0.5,styleFor("bidiverging_automata.5tuple.states"),"opacity",1),
            linear(0.5,styleFor("bidiverging_automata.5tuple.transitions"),"opacity",1),
            linear(0.5,styleFor("bidiverging_automata.5tuple.final"),"opacity",1)
        ),
        "",
        hireAndFadeIn(0.5,"bidiverging_automata.criterion"),
        "",
        fadeOutAndFire(0.5,
            "bidiverging_automata.5tuple",
            "bidiverging_automata.5tuple.alphabet",
            "bidiverging_automata.5tuple.cover",
            "bidiverging_automata.5tuple.states",
            "bidiverging_automata.5tuple.transitions",
            "bidiverging_automata.5tuple.initial",
            "bidiverging_automata.5tuple.final",
            "bidiverging_automata.criterion"
        ),
    // }}}
    // Kleene's Theorem {{{
        rotateNextTitle(),
        hireAndFlashIn(0.75,0.375,
            "bidiverging_kleene1",
            "bidiverging_kleene2",
            "bidiverging_kleene3"
        ),
        "",
        fadeOutAndFire(0.5,
            "bidiverging_kleene1",
            "bidiverging_kleene2",
            "bidiverging_kleene3"
        ),
    // }}}
    // Outline {{{
        rotateNextTitle(),
        hireUseActor("outline.highlight"),
        set("outline.highlight","y",160),
        parallel(
            hireAndFadeInUseActors(0.5,
                "outline.1",
                "outline.2",
                "outline.3"
            ),
            fadeIn(0.5,"outline.highlight")
        ),
        "",
        smooth(0.5,"outline.highlight","y",320),
        "",
        fadeOutAndFire(0.5,
            "outline.highlight",
            "outline.1",
            "outline.2",
            "outline.3"
        ),
    // }}}
    // Ansatz criteria {{{
        rotateNextTitle(),
        "",
        hireAndFlashIn(0.5,0.25,
            "ansatz.criteria.1",
            "ansatz.criteria.2",
            "ansatz.criteria.3"
        ),
        "",
        hireAndFadeInUseActors(0.5,
            "ansatz.check.1",
            "ansatz.check.2"
        ),
        "",
        hireAndFadeIn(0.5,"ansatz.circle_around_3"),
        "",
        fadeOutAndFire(0.5,
            "ansatz.criteria.1",
            "ansatz.criteria.2",
            "ansatz.criteria.3",
            "ansatz.check.1",
            "ansatz.check.2",
            "ansatz.circle_around_3"
        ),
    // }}}
    // Dual automata {{{
        rotateNextTitle(),
        hireAndFadeIn(0.5,"dual_automata.definition"),
        "",
        parallel(
            sequence(
                wait(0),
                hireAndFadeIn(0.5,"dual_automata.automata",makePartFocusActor("dual_automata.automata",["transitions","misc"]))
            ),
            sequence(
                wait(0.25),
                hireAndFadeIn(0.5,"dual_automata.arrow")
            ),
            sequence(
                wait(0.5),
                hireAndFadeIn(0.5,"dual_automata.transducer",makePartFocusActor("dual_automata.transducer",["transitions","misc"]))
            )
        ),
        "",
        set("dual_automata.automata","transitions.opacity",1),
        set("dual_automata.transducer","transitions.opacity",1),
        parallel(
            linear(0.5,"dual_automata.automata","non_focused_opacity",0.25),
            linear(0.5,"dual_automata.transducer","non_focused_opacity",0.25)
        ),
        "",
        parallel(
            linear(0.5,"dual_automata.automata","non_focused_opacity",1),
            linear(0.5,"dual_automata.transducer","non_focused_opacity",1)
        ),
        set("dual_automata.automata","transitions.opacity",0),
        set("dual_automata.transducer","transitions.opacity",0),
        "",
        fadeOutAndFire(0.5,
            "dual_automata.definition",
            "dual_automata.automata",
            "dual_automata.arrow",
            "dual_automata.transducer"
        ),
    // }}}
    // Expectation recipe {{{
        rotateNextTitle(),
        hireAndFlashIn(0.5,0.25,
            "recipe.text.1",
            "recipe.text.2"
        ),
        "",
        hireAndFadeIn(0.5,"recipe.state"),
        hireAndFadeIn(0.5,"recipe.expectation"),
        "",
        hireUseActor("recipe.state.cover","recipe.state"),
        hireUseActor("recipe.dual","recipe.state.cover"),
        linear(0.5,"recipe.state.cover","x",350),
        fire("recipe.state.cover"),
        "",
        hireUseActor("recipe.state.cover","recipe.dual"),
        hireUseActor("recipe.observable","recipe.state.cover"),
        linear(0.5,"recipe.state.cover","x",350),
        fire("recipe.state.cover"),
        "",
        hireUseActor("recipe.apply.cover","recipe.observable"),
        hireUseActor("recipe.apply","recipe.apply.cover"),
        linear(0.5,"recipe.apply.cover","x",350),
        fire("recipe.apply.cover"),
        "",
        hireUseActor("recipe.jordan.cover","recipe.text.2"),
        hireUseActor("recipe.jordan","recipe.jordan.cover"),
        linear(0.25,"recipe.jordan.cover","y",-170),
        fire("recipe.jordan.cover"),
        "",
        hireUseActor("recipe.function.cover","recipe.text.1"),
        hireUseActor("recipe.function","recipe.function.cover"),
        linear(0.35,"recipe.function.cover","x",-270),
        fire("recipe.function.cover"),
        "",
        fadeOutAndFire(0.5,
            "recipe.apply",
            "recipe.dual",
            "recipe.expectation",
            "recipe.function",
            "recipe.jordan",
            "recipe.observable",
            "recipe.state",
            "recipe.text.1",
            "recipe.text.2"
        ),
    // }}}
    // Outline {{{
        rotateNextTitle(),
        hireAndFadeInUseActors(0.5,
            "outline.1",
            "outline.2",
            "outline.3"
        ),
    // }}}
// }}} Script
    ]))
},false)
