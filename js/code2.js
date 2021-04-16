function initGraph(cy, input) {
    cy.add(input);
    nodes = cy.nodes();
    for (var j = 0; j < nodes.length; j++) {
        id = nodes[j].data("id");
        nodes[j].style("background-image", fileURIs.get(id));
    }

    layout = cy.layout({ name: 'preset', directed: true, padding: 10 });
    layout.run();
    console.log("init ok");
}

function exportGraphJSON(cy) {
    window.localStorage.setItem("elements", JSON.stringify( cy.json() ));
    console.log(cy.json());
    console.log("save json ok");
}

function importJSON(cy,input){
    cy.elements().remove();
    nodes = cy.nodes();
    cy.json({ elements: JSON.parse( window.localStorage.getItem("elements") ).elements }).layout({ name: 'preset' }).run();
    cy.add(input);
    nodes = cy.nodes();
    for (var j = 0; j < nodes.length; j++){
        id = nodes[j].data("id");
        nodes[j].style("background-image", fileURIs.get(id));
    }
    console.log("loaded json");
}

function exportJPG(cy) {
    var mon_image = cy.jpg();
    console.log(cy.jpg());
    document.querySelector('output').setAttribute('src', mon_image);
}
