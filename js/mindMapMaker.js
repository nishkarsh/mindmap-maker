/**
 * Created by nishkarshsharma on 15/09/14.
 */

function updateJSON(spaceTree) {
    //alert(JSON.stringify(spaceTree.toJSON()));
    document.getElementById("jsonInput").value=JSON.stringify(spaceTree.toJSON('tree'));
}

function updateMindMap(updatedJSONString) {
    //alert(updatedJSONString);
    var updatedJSON=JSON.parse(updatedJSONString);
    st.loadJSON(updatedJSON);
    st.refresh();
}

function assignLabel(node, newLabel)
{
    var decoratedLabel=newLabel;
    if(hasLink(node)) {
        decoratedLabel = "<a href='" + node.data.href + "'>" + newLabel + "</a>";
    }
    if(hasIcon(node))   {
        decoratedLabel = decoratedLabel + " <i class='"+node.data.icon+"' height='"+ getIconHeight(node) +"' width='"+ getIconWidth(node) +"'></i>";
    }
    return decoratedLabel;
}

function changeLabel(node,newLabel) {
    node.name = newLabel;
    label=st.labels.getLabel(node.id);
    label.innerHTML = assignLabel(node, node.name);
    updateJSON(st);
    st.onClick(node.id);
}

function hasLink(node)  {
    if(node.data.href != undefined)
        return true;
    else
        return false;
}

function hasIcon(node)  {
    if(node.data.icon != undefined)
        return true;
    else
        return false;
}

function getIconHeight(node) {
    return (node.data.iconHeight != undefined) ? node.data.iconHeight : 50;
}

function getIconWidth(node) {
    return (node.data.iconWidth != undefined) ? node.data.iconWidth : 50;
}

function reinit() {
    json=parse();
    initOrn();
    st.loadJSON(json);
    st.plot();
    st.refresh();
    $jit.id("jsonInput").innerHTML=JSON.stringify(json);
}

//override JIT default node alignment behaviour
function modifyPosition(node) {
    //the alignment of node should be same as the orientation
    return node.data.$orn!=undefined?node.data.$orn:'right';
}