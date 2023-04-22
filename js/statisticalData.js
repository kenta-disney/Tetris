function viewStorage(){

    let hour,min,s;;
    
    let localStorageTotalAndMaxTetris = JSON.parse(localStorage.getItem("localStorageTotalAndMaxTetris"));

    if(localStorageTotalAndMaxTetris == null){
      localStorageTotalAndMaxTetris = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      ];
    }

    //alert(localStorageTotalAndMaxTetris);

    min = Math.floor(localStorageTotalAndMaxTetris[0][2] / 60);
    s = Math.floor(localStorageTotalAndMaxTetris[0][2] % 60);
    hour = Math.floor(min / 60);
    min = Math.floor(min % 60);

    document.getElementById("printTotalScore").innerHTML = localStorageTotalAndMaxTetris[0][0];
    document.getElementById("printTotalDate").innerHTML = localStorageTotalAndMaxTetris[0][1];
    document.getElementById("printTotalTime").innerHTML =  hour + "時間" + min + "分" + s + "秒";
    document.getElementById("printTotalClearLine").innerHTML = localStorageTotalAndMaxTetris[0][3];
    document.getElementById("printTotalGameLevel").innerHTML = localStorageTotalAndMaxTetris[0][4];
    document.getElementById("printTotalSingle").innerHTML = localStorageTotalAndMaxTetris[0][6];
    document.getElementById("printTotalDouble").innerHTML = localStorageTotalAndMaxTetris[0][7];
    document.getElementById("printTotalTriple").innerHTML = localStorageTotalAndMaxTetris[0][8];
    document.getElementById("printTotalTetris").innerHTML = localStorageTotalAndMaxTetris[0][9];
    document.getElementById("printTotalPerfectClear").innerHTML = localStorageTotalAndMaxTetris[0][10];

    document.getElementById("printTotalTSpinSingleMini").innerHTML = localStorageTotalAndMaxTetris[0][11];
    document.getElementById("printTotalTSpinDoubleMini").innerHTML = localStorageTotalAndMaxTetris[0][12];
    document.getElementById("printTotalTSpinMini").innerHTML = localStorageTotalAndMaxTetris[0][13];
    document.getElementById("printTotalTSpinSingle").innerHTML = localStorageTotalAndMaxTetris[0][14];
    document.getElementById("printTotalTSpinDouble").innerHTML = localStorageTotalAndMaxTetris[0][15];
    document.getElementById("printTotalTSpinTriple").innerHTML = localStorageTotalAndMaxTetris[0][16];
    document.getElementById("printTotalTSpin").innerHTML = localStorageTotalAndMaxTetris[0][17];
    document.getElementById("printTotalBackToBack").innerHTML = localStorageTotalAndMaxTetris[0][18];
    document.getElementById("printTotalRotate").innerHTML = localStorageTotalAndMaxTetris[0][19];
    document.getElementById("printTotalFallDistance").innerHTML = localStorageTotalAndMaxTetris[0][20];
    document.getElementById("printTotalHold").innerHTML = localStorageTotalAndMaxTetris[0][21];

    min = Math.floor(localStorageTotalAndMaxTetris[1][2] / 60);
    s = Math.floor(localStorageTotalAndMaxTetris[1][2] % 60);
    hour = Math.floor(min / 60);
    min = Math.floor(min % 60);

    document.getElementById("printMaxScore").innerHTML = localStorageTotalAndMaxTetris[1][0];
    document.getElementById("printMaxTime").innerHTML = hour + "時間" + min + "分" + s + "秒";
    document.getElementById("printMaxClearLine").innerHTML = localStorageTotalAndMaxTetris[1][3];
    document.getElementById("printMaxGameLevel").innerHTML = localStorageTotalAndMaxTetris[1][4];
    document.getElementById("printMaxCombo").innerHTML = localStorageTotalAndMaxTetris[1][5];
    document.getElementById("printMaxSingle").innerHTML = localStorageTotalAndMaxTetris[1][6];
    document.getElementById("printMaxDouble").innerHTML = localStorageTotalAndMaxTetris[1][7];
    document.getElementById("printMaxTriple").innerHTML = localStorageTotalAndMaxTetris[1][8];
    document.getElementById("printMaxTetris").innerHTML = localStorageTotalAndMaxTetris[1][9];
    document.getElementById("printMaxPerfectClear").innerHTML = localStorageTotalAndMaxTetris[1][10];

    document.getElementById("printMaxTSpinSingleMini").innerHTML = localStorageTotalAndMaxTetris[1][11];
    document.getElementById("printMaxTSpinDoubleMini").innerHTML = localStorageTotalAndMaxTetris[1][12];
    document.getElementById("printMaxTSpinMini").innerHTML = localStorageTotalAndMaxTetris[1][13];
    document.getElementById("printMaxTSpinSingle").innerHTML = localStorageTotalAndMaxTetris[1][14];
    document.getElementById("printMaxTSpinDouble").innerHTML = localStorageTotalAndMaxTetris[1][15];
    document.getElementById("printMaxTSpinTriple").innerHTML = localStorageTotalAndMaxTetris[1][16];
    document.getElementById("printMaxTSpin").innerHTML = localStorageTotalAndMaxTetris[1][17];
    document.getElementById("printMaxBackToBack").innerHTML = localStorageTotalAndMaxTetris[1][18];
    document.getElementById("printMaxRotate").innerHTML = localStorageTotalAndMaxTetris[1][19];
    document.getElementById("printMaxFallDistance").innerHTML = localStorageTotalAndMaxTetris[1][20];
    document.getElementById("printMaxHold").innerHTML = localStorageTotalAndMaxTetris[1][21];
};


window.onload = function() {

  viewStorage();
};