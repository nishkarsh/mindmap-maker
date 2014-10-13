/**
 * Created by nishkarshsharma on 24/09/14.
 */

var json;
var prevTabNum=0;

function parse() {
    var nodenum=0;
    var text=document.getElementById("text").value;
    var regex= /^[a-zA-Z0-9]+/;     //for root
    var regex2= /^[ \t]+[a-zA-Z0-9]+/;  //for indented subnodes
    var linkrx= /[(]href:[a-zA-Z0-9]+:\/\/[a-zA-Z]+[.][a-zA-Z0-9]+[.][a-zA-Z0-9]+[)]/g;
    var rootFound=false;
    prevTabNum=0;
    var lines=text.split("\n");
    for(var i=0; i<lines.length;i++) {
        nodenum++;
        if(regex2.test(lines[i])) {
            nodeLabel=lines[i];
            output=output+buildJSON(nodeLabel, nodenum);
        }
        else if(regex.test(lines[i]) && rootFound==false){
            rootFound=true;
            nodeLabel=lines[i];
            if(linkrx.test(nodeLabel)) {
                var link=nodeLabel.split("(");
                nodeLabel=link[0];
                var permlink=link[1].split("href:")[1].split(")")[0];
            }
            var output='{"id":"node'+nodenum+'","name":"'+nodeLabel+'","data":{"href":"'+permlink+'"},"children":[';
        }
    }
    output=output+"]}";
    for(var j=0;j<numberOfTabs(lines[lines.length-2]);j++)
    {
        output=output+"]}";
    }
    return JSON.parse(output);
}

function buildJSON(nodeLabel, nodenum) {
    if(numberOfTabs(nodeLabel) == prevTabNum) {
        return ']},{"id":"node'+nodenum+'","name":"'+(nodeLabel.trim())+'","data":{},"children":[';
    }
    else if(numberOfTabs(nodeLabel) > prevTabNum) {
        prevTabNum++;
        return '{"id":"node'+nodenum+'","name":"'+(nodeLabel.trim())+'","data":{},"children":[';
    }
    else if(numberOfTabs(nodeLabel) < prevTabNum){
        var pnum=prevTabNum;
        var cnum=numberOfTabs(nodeLabel);
        prevTabNum=cnum;
        var closes="]}";
        for(var i=0;i<(pnum-cnum);i++)
        {
            closes=closes+"]}"
        }
        return closes+',{"id":"node'+nodenum+'","name":"'+(nodeLabel.trim())+'","data":{},"children":[';
    }
}

function numberOfTabs(text) {
    var count = 0;
    var index = 0;
    while ((text.charAt(index) === " ")||(text.charAt(index) === "\t")) {
        index++;
        count++;
    }
    return count;
}