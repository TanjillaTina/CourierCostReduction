

var getUserDetail=function(userr){
//console.log("Printing Username",user);

var det=[];
var i=0;
var username="";
var designation="";
var dept="";
var comname="";
    while(userr[i]!='(' &&  i<userr.length) 
    {
        username=username+userr[i];
     i++;
    }

   // console.log("Printing username from here ",userNamee,"Index is ",i);

    i=i+1;
    while(userr[i]!=',' &&  i<userr.length) 
    {
        designation=designation+userr[i];
     i++;
    }
   // console.log("Printing designation from here ",designation,"Index is ",i);
  i=i+1;

while(userr[i]!=',' &&  i<userr.length) 
    {
        dept=dept+userr[i];
     i++;
    }
   // console.log("Printing dept from here ",dept,"Index is ",i);

    i=i+2;

    while(userr[i]!=')' &&  i<userr.length) 
    {
        comname=comname+userr[i];
     i++;
    }
    //console.log("Printing comname from here ",comname,"Index is ",i);

det.push(username);
det.push(comname);
det.push(designation);
det.push(dept);


//console.log("Printing det ",det);
return comname;

};

module.exports={
    getUserDetail
}