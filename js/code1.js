var input = input["items"];

var fileURIs = new Map();
var cy = cytoscape({
    container: document.getElementById('cy'),
    boxSelectionEnabled: false,
    autounselectify: true,
    style: cytoscape.stylesheet()
        .selector('node')
        .css({
            'height': 10,
            'width': 10,
            'shape': 'rectangle',
            'background-fit': 'cover',
            'border-color': '#000',
            'border-width': 0,
            'border-opacity': 0.5
        })
        .selector('edge')
        .css({
            'width': 0.1,
            'target-arrow-shape': 'triangle',
            'arrow-scale': 0.1,
            'line-color': '#000',
            'target-arrow-color': '#000'
        })
});


function showFile() {
    var fileInput = document.querySelector("input[type=file]");

    for (var i = 0; i < fileInput.files.length; i++) {
        var reader = new FileReader();
        reader.fileName = fileInput.files[i].name;
        reader.onload = function(readerEvent) {
            var url = readerEvent.target.result;
            var name = readerEvent.target.fileName;
            console.log(name.slice(0, -4));
            fileURIs.set(name.slice(0, -4), url);
        }
        reader.readAsDataURL(fileInput.files[i]);
    }
    console.log("loading ok")
};

function expandGraph(cy) {
    nodes = cy.nodes();
    nodes.style('height', 5);
    nodes.style('width', 5);
    nodes.style('text-opacity', 0.5);
    nodes.style('color', 'red');
    nodes.style('font-size', 1);
    nodes.style('text-halign', 'center');
    nodes.style('text-valign', 'center');

    for (var j = 0; j < nodes.length; j++) {
        nodes[j].style('label', nodes[j].data('id'));
        H = 0;
        B = 0;
        G = 0;
        D = 0;
        out_edges = nodes[j].outgoers('edge');
        for (var k = 0; k < out_edges.length; k++) {
            out_edge = out_edges[k];
            if (out_edge.data('label') == "H") {
                H += 1;
            } else if (out_edge.data('label') == "B") {
                B += 1;
            } else if (out_edge.data('label') == "G") {
                G += 1;
            } else if (out_edge.data('label') == "D") {
                D += 1;
            }
        }
        if (H > 1 || B > 1 || G > 1 || D > 1) {
            // conflict in pairwise assembly
            nodes[j].style('border-width', 0.1);
            nodes[j].style('border-color', 'red');
        } else {
            nodes[j].style('border-width', 0);
            nodes[j].style('border-color', 'black');
        }
    }

    edges = cy.edges();
    edges.style('text-opacity', 0.5);
    edges.style('width', 0.1);
    edges.style('arrow-scale', 0.1);
    edges.style('color', 'red');
    edges.style('font-size', 1);
    edges.style('curve-style', 'bezier');
    edges.style('control-point-step-size', 4);
    for (var j = 0; j < edges.length; j++) {
        edges[j].style('label', edges[j].data('label') + " " + edges[j].data('proba'));
    }

    layout = cy.layout({ name: 'preset', directed: true, padding: 10 });
    layout.run();
    console.log("expanded");

    cy.edges().on('click', function(evt) {
        console.log('deleting edge ' + evt.target.id());
        cy.remove(evt.target);
    });
}

function retractGraph(cy) {
    nodes = cy.nodes();
    nodes.style('height', 10);
    nodes.style('width', 10);
    nodes.style('text-opacity', 0);

    edges = cy.edges();
    edges.style('text-opacity', 0);
    edges.style('width', 0);
    edges.style('arrow-scale', 0);

    layout = cy.layout({ name: 'preset', directed: true, padding: 10 });
    layout.run();
    console.log("retracted");
}

function filterEdges(cy) {
    var thr = prompt("Threshold for edge filtering?");
    cy.remove('edge[proba < ' + thr + ']');
    nodes = cy.nodes();
    for (var j = 0; j < nodes.length; j++) {
        if (nodes[j].connectedEdges().length == 0) {
            cy.remove(nodes[j])
        }
    }
    console.log("filtered")

}

function nodePositions(cy) {
    elements = cy.elements();
    components = elements.components();
    console.log(components.length);
    nodes = cy.nodes();
    origin_pos = { 'x': 0, 'y': 0 };
    for (i = 0; i < components.length; i++) {
        component = components[i];
        root = component[0];
        console.log("root ", root.id());
        dps = component.depthFirstSearch({
            roots: root,
            visit: function(v, e, u, i, depth) {
                console.log("v ", v.id());
                if (v == root) {
                    v.position(origin_pos);
                    origin_pos['x'] += 50;
                } else if (e.source() == u) {
                    console.log("S ", e.source().id());
                    console.log("T ", e.target().id());
                    pos = u.position();
                    x = pos['x'];
                    y = pos['y'];
                    if (e.data('label') == "H") {
                        v.position({ 'x': x, 'y': y - 10 });
                    } else if (e.data('label') == "B") {
                        v.position({ 'x': x, 'y': y + 10 });
                    } else if (e.data('label') == "G") {
                        v.position({ 'x': x - 10, 'y': y });
                    } else if (e.data('label') == "D") {
                        v.position({ 'x': x + 10, 'y': y });
                    }
                } else if (e.source() == v) {
                    console.log("S ", e.source().id());
                    console.log("T ", e.target().id());
                    pos = u.position();
                    x = pos['x'];
                    y = pos['y'];
                    if (e.data('label') == "H") {
                        v.position({ 'x': x, 'y': y + 10 });
                    } else if (e.data('label') == "B") {
                        v.position({ 'x': x, 'y': y - 10 });
                    } else if (e.data('label') == "G") {
                        v.position({ 'x': x + 10, 'y': y });
                    } else if (e.data('label') == "D") {
                        v.position({ 'x': x - 10, 'y': y });
                    }
                }
            },
            directed: false
        });
    }

    //layout = cy.layout({name: 'preset', directed: true, padding: 10});
    //layout.run();
    console.log("positions recomputed");
}