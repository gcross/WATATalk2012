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
// }}} Script
    ]))
},false)
