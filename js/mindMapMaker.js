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
        decoratedLabel = decoratedLabel + "<br><img src='"+node.data.icon+"' height='"+ getIconHeight(node) +"' width='"+ getIconWidth(node) +"'>";
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