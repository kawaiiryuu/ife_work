function getDateStr(dat){
    var y=dat.getFullYear();
    var m=dat.getMonth()+1;
    if(m<10)m='0'+m;
    var d=dat.getDate();
    if(d<10)d='0'+d;
    return y+'-'+m+'-'+d;
}

function randomBuildData(seed){
    var res={};
    var dat=new Date("2016-03-01");
    var datStr="";
    for(var i=0;i<92;i++){
        datStr=getDateStr(dat);
        res[datStr]=Math.ceil(Math.random()*seed);
        dat.setDate(dat.getDate()+1);
    }
    return res;
}

var aqiSourceData={
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

var chartData={};

var pageState={
    selectCity:"北京",
    graTime:"day"
};

var convert={
    "day":"每日",
    "week":"周平均",
    "month":"月平均"
};

function renderChart(){
    var old=document.getElementById("aqi-chart-wrap");
    var chart=document.createElement("DIV");
    chart.id="aqi-chart-wrap";
    var data=chartData[pageState.graTime][pageState.selectCity];
    for(var i in data){
        var a=document.createElement("DIV");
        var b=document.createElement("DIV");
        b.innerHTML=i+"<br>AQI: "+data[i];
        b.className="hint";
        a.appendChild(b);
        a.className=pageState.graTime+" bar";
        a.style="background:rgb("+(Math.floor(data[i]/100)*50)+","+(255-Math.floor(data[i]/100)*50)+",255);height:"+data[i]+"px";
        chart.appendChild(a);
    }
    old.parentNode.replaceChild(chart,old);
    var a=document.getElementById("title");
    a.innerHTML=pageState.selectCity+"2016年04-06月"+convert[pageState.graTime]+"空气质量报告";
}

function graTimeChange(evt){
    var s=evt.target.value;
    if(pageState.graTime!=s){
        pageState.graTime=s;
        renderChart();
    }
}

function citySelectChange(evt){
    var s=evt.target.value;
    if(pageState.selectCity!=s){
        pageState.selectCity=s;
        renderChart();
    }
}

function initGraTimeForm(){
    var a=document.getElementsByName("gra-time");
    for(var i in a)
        if(typeof a[i]==='object')
            a[i].addEventListener("click",graTimeChange);
}

function initCitySelector(){
    var selector=document.getElementById("city-select");
    for(var i in aqiSourceData){
        var option=document.createElement("OPTION");
        option.innerHTML=i;
        selector.appendChild(option);
    }
    document.getElementById("city-select").addEventListener("change",citySelectChange);
}

function initAqiChartData(){
    chartData.day=aqiSourceData;
    chartData.month={};
    chartData.week={};
    for(i in aqiSourceData){
        var dcnt=0,wcnt=0,wtot=0,mtot=0;
        var keys=Object.keys(aqiSourceData[i]);
        var m=keys[0].slice(5,7);
        chartData.month[i]={};
        chartData.week[i]={};
        for(var j=0;j<keys.length;j++){
            dcnt++;
            wtot+=aqiSourceData[i][keys[j]];
            mtot+=aqiSourceData[i][keys[j]];
            if(j+1==keys.length||keys[j+1].slice(5,7)!=m){
                chartData.month[i][keys[j].slice(0,7)]=Math.round(mtot/dcnt);
                wcnt++;
                chartData.week[i][keys[j].slice(0,7)+" 第"+wcnt+"周"]=Math.round(wtot/(dcnt-(wcnt-1)*7));
                mtot=wtot=wcnt=dcnt=0;
                if(j+1!=keys.length)m=keys[j+1].slice(5,7);
            }
            else if(dcnt%7==0){
                wcnt++;
                chartData.week[i][keys[j].slice(0,7)+" 第"+wcnt+"周"]=Math.round(wtot/7);
                wtot=0;
            }
        }
    }
    renderChart();
}

function init(){
    initCitySelector();
    initGraTimeForm();
    initAqiChartData();
}