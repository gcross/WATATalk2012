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
        "",
    // }}}
// }}} Script
    ]))
},false)
