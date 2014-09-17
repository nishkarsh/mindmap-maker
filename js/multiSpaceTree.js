/**
 * Created by nishkarshsharma on 15/09/14.
 */

var labelType, useGradients, nativeTextSupport, animate, selectedNode;

(function() {
    var ua = navigator.userAgent,
        iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
        typeOfCanvas = typeof HTMLCanvasElement,
        nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
        textSupport = nativeCanvasSupport
            && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
    //I'm setting this based on the fact that ExCanvas provides text support for IE
    //and that as of today iPhone/iPad current text support is lame
    labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
    nativeTextSupport = labelType == 'Native';
    useGradients = nativeCanvasSupport;
    animate = !(iStuff || !nativeCanvasSupport);
})();

var st; //SpaceTree Variable

function init(){
    //alert(document.getElementById("jsonInput").value=JSON.stringify(json));
    //preprocess subtrees orientation
    var arr = json.children, len = arr.length;
    for(var i=0; i < len; i++) {
        //split half left orientation
        if(i < len / 2) {
            arr[i].data.$orn = 'left';
            $jit.json.each(arr[i], function(n) {
                n.data.$orn = 'left';
            });
        } else {
            //half right
            arr[i].data.$orn = 'right';
            $jit.json.each(arr[i], function(n) {
                n.data.$orn = 'right';
            });
        }
    }
    //end

    //init Spacetree
    //Create a new ST instance
    st = new $jit.ST({
        //id of viz container element
        injectInto: 'infovis',
        //multitree
        multitree: true,
        //set duration for the animation
        duration: 50,
        //set animation transition type
        transition: $jit.Trans.Quart.easeInOut,
        //set distance between node and its children
        levelDistance: 40,
        //sibling and subtrees offsets
        siblingOffset: 3,
        subtreeOffset: 3,
        //set node and edge styles
        //set overridable=true for styling individual
        //nodes or edges
        Node: {
            autoWidth: true,
            autoHeight: true,
            type: 'rectangle',
            color: '#fff',
            overridable: true,
            //set canvas specific styles
            //like shadows
            CanvasStyles: {
                shadowColor: '#ccc',
                shadowBlur: 2
            }
        },
        Edge: {
            type: 'bezier',
            lineWidth: 2,
            color:'#23A4FF',
            overridable: true
        },

        //This method is called on DOM label creation.
        //Use this method to add event handlers and styles to
        //your node.
        onCreateLabel: function(label, node){
            label.id = node.id;
            label.innerHTML = assignLabel(node,node.name);
            label.onclick = function(){
               st.onClick(node.id);
            };

            label.ondblclick = function editLabel() {
                label.innerHTML="<input type=text style='border:0px;' id=nodeLabel value='"+node.name+"'>";
            }

            label.onkeydown= function changeLabel(event) {
                if(event.keyCode==13) {
                    var newLabel=$jit.id("nodeLabel").value;
                    node.name=newLabel;
                    label.innerHTML= assignLabel(node,node.name);
                    updateJSON(st);
                    st.onClick(node.id);
                }
            }

            //set label styles
            var style = label.style;
            style.width = 'auto';
            style.height = 'auto';
            style.cursor = 'pointer';
            style.color = '#333';
            style.textAlign = 'center';
            style.padding = '4px';
            style.lineHeight = '1.25';
        },

        //This method is called right before plotting
        //a node. It's useful for changing an individual node
        //style properties before plotting it.
        //The data properties prefixed with a dollar
        //sign will override the global node style properties.
        onBeforePlotNode: function(node){
            //add some color to the nodes in the path between the
            //root node and the selected node.
            if (node.selected) {
                node.data.$color = "#75A9FF";
            }
            else {
                delete node.data.$color;
                }
        },

        //This method is called right before plotting
        //an edge. It's useful for changing an individual edge
        //style properties before plotting it.
        //Edge data proprties prefixed with a dollar sign will
        //override the Edge global style properties.
        onBeforePlotLine: function(adj){
            if (adj.nodeFrom.selected && adj.nodeTo.selected) {
                adj.data.$color = "#eed";
                adj.data.$lineWidth = 3;
            }
            else {
                delete adj.data.$color;
                delete adj.data.$lineWidth;
            }
        }
    });
    //load json data
    st.loadJSON(json);
    //compute node positions and layout
    st.compute('end');
    st.select(st.root);
    //end
    //Put the updated json string to the textarea
    document.getElementById("jsonInput").value=JSON.stringify(json);
}