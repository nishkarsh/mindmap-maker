/**
 * Created by nishkarshsharma on 15/09/14.
 */

var labelType, useGradients, nativeTextSupport, animate, selectedNode;
var st; //SpaceTree Variable

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


function initOrn() {
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
}

function init(){
    //alert(document.getElementById("jsonInput").value=JSON.stringify(json));
    initOrn();

    //init Spacetree
    //Create a new ST instance
    st = new $jit.ST({
        //id of viz container element
        injectInto: 'infovis',
        //multitree,
        multitree: true,
        //set duration for the animation
        duration: 0,
        //set animation transition type
        transition: $jit.Trans.Quart.easeInOut,
        //set distance between node and its children
        levelDistance: 30,
        align: 'bottom',
        //sibling and subtrees offsets
        siblingOffset: 3,
        subtreeOffset: 3,
        //set node and edge styles
        //set overridable=true for styling individual
        //nodes or edges
        Node: {
            autoWidth: true,
            autoHeight: true,
            padding: '1',
            type: 'ellipse',
            color: '#fff',
            lineWidth: 2,
            align: 'center',
            overridable: true,
            //set canvas specific styles
            //like shadows
            CanvasStyles: {
                shadowColor: '#ccc',
                shadowBlur: 1
            }
        },
        Edge: {
            type: 'bezier',
            lineWidth: 2,
            color:'black',
            overridable: true
        },

        //This method is called on DOM label creation.
        //Use this method to add event handlers and styles to
        //your node.
        onCreateLabel: function(label, node){
            label.id = node.id;
            label.innerHTML = assignLabel(node,node.name);
            label.onclick = function(){
               selectedNode=node;
               st.select(node.id);
            }

            //set label styles
            var style = label.style;
            style.width = 'auto';
            style.height = 'auto';
            style.cursor = 'pointer';
            style.color = '#333';
            style.textAlign = 'center';
            style.padding = '1px';
            style.lineHeight = '0.5';
            style.borderBottom = '2px solid black';
        },

        //This method is called right before plotting
        //a node. It's useful for changing an individual node
        //style properties before plotting it.
        //The data properties prefixed with a dollar
        //sign will override the global node style properties.
        onBeforePlotNode: function(node){
            if (node.selected) {
                node.data.$color = "#ccc";
                node.data.$type = "rectangle";
            }
            else {
                delete node.data.$color;
                node.data.$type = "none";
            }
            if(node.id == st.root) {
                node.data.$type = "ellipse";
                node.data.$color = "#fff";

                node.data.$width=node.data.$width+8;
                node.data.$height=node.data.$height+15;
            }

            var colors= ["#ccc","yellow","orange","lightblue","red","pink","lightgreen"];
            node.data.$color= colors[node._depth];
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
        },

        onComplete: function(){
            $("#node1").css("line-height","2");
            $("#node1").css("background","#ccc");
            $("#node1").css("border-radius","20px");
            //$("#node1").css("font-size",22);
            $("#node1").css("padding",5);
            //$("#node1").css("height",parseInt($("#node1").css("height")));
            //$("#node1").css("width",parseInt($("#node1").css("width")));
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