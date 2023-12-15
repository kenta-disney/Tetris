const BLOCK_SIZE = 24;//1ブロックのサイズ
const FIELD_HEIGHT = 22;//フィールドの縦幅
const FIELD_WIDTH = 12;//フィールドの横幅

const LEFT_FIELD_WIDTH = BLOCK_SIZE * 6;//左の表示の幅
const RIGHT_FIELD_WIDTH = BLOCK_SIZE * 6;//右の表示の幅
const UP_FIELD_HEIGHT = BLOCK_SIZE * 1;//上の表示の幅
const DOWN_FIELD_HEIGHT = BLOCK_SIZE * 2;//下の表示の幅

const TIME_FIELD_HEIGHT = BLOCK_SIZE * 3;//時間の表示の幅

const SCREEN_WIDTH = BLOCK_SIZE * FIELD_WIDTH + LEFT_FIELD_WIDTH + RIGHT_FIELD_WIDTH;//キャンバスの横幅
const SCREEN_HEIGHT = BLOCK_SIZE * FIELD_HEIGHT +  UP_FIELD_HEIGHT +  DOWN_FIELD_HEIGHT;//ゲーム中のキャンバスの縦幅
const SCREEN_HEIGHT_OTHER = BLOCK_SIZE * FIELD_HEIGHT +  UP_FIELD_HEIGHT + TIME_FIELD_HEIGHT + DOWN_FIELD_HEIGHT;//ゲーム画面以外のキャンバスの縦幅

const TETRIMINO_WIDTH = 4;//テトリミノの横幅
const TETRIMINO_HEIGHT = 4;//テトリミノの縦幅
const TETRIMINO_KINDS = 7;//テトリミノの種類数
const TETRIMINO_ANGLES = 4;//テトリミノの角度数
const TETRIMINO_NEXTKINDS = 6;//ネクストテトリミノの表示数

const FALL_BASE_X = 4;//初期落下位置のX座標
const FALL_BASE_Y = 1;//初期落下位置のY座標

//色
const BACK_COLOR = "#BBBBBB";//背景色

const COLOR_BLACK = "#000";
const COLOR_WHITE = "#FFF";
const COLOR_LIGHTBLUE = "#0FF";
const COLOR_YELLOW = "#FF0";
const COLOR_PURPLE = "#800080";
const COLOR_BLUE = "#00F";
const COLOR_ORANGE = "#FF6600";
const COLOR_GREEN = "#008000";
const COLOR_RED = "#F00";

const COLOR_LIGHTBLUE_FALL = "#CCFFFF";
const COLOR_YELLOW_FALL = "#FFFF99";
const COLOR_PURPLE_FALL = "#D0B0FF";
const COLOR_BLUE_FALL = "#66CCFF";
const COLOR_ORANGE_FALL = "#FFAD90";
const COLOR_GREEN_FALL = "#93FFAD";
const COLOR_RED_FALL = "#FF6666";

//隠しコマンドで使う色
const COLOR_GRAY_HALFSECRETDRAW = "#666666";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));//一定秒数待つ

/*----------------------------------------------------------------------------------------------------*/
let blockSize;//ブロックサイズ

let canvasGame = null;//キャンバス取得
let gameWindow = null;//コンテキスト取得

let canvasTime = null;
let timeWindow = null;

let canvasAll = null;
let allWindow = null;

let blockType = {//フィールドのブロックの種類
	FREE: 0, WALL: 1, CONTROL_LIGHTBLUE: 2, CONTROL_YELLOW: 3, CONTROL_PURPLE: 4,
	CONTROL_BLUE: 5, CONTROL_ORANGE: 6, CONTROL_GREEN: 7, CONTROL_RED: 8, FIX_LIGHTBLUE: 9,
	FIX_YELLOW: 10, FIX_PURPLE: 11, FIX_BLUE: 12, FIX_ORANGE: 13, FIX_GREEN: 14,
	FIX_RED: 15, FALL_POSITION_LIGHTBLUE: 16,FALL_POSITION_YELLOW:17,FALL_POSITION_PURPLE: 18,
	FALL_POSITION_BLUE: 19, FALL_POSITION_ORANGE: 20,FALL_POSITION_GREEN: 21,FALL_POSITION_RED: 22
};

let screenState = {//画面の状態
	TITLE: 0, drawCountDown: 1,RUNNING: 2, GAMEOVER: 3,
	HELP: 4, RANKING: 5,EXITWAIT: 6
};

let playField= [//12×22のフィールド
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

/*
let playField= [//動作確認
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 1],
	[1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 1],
	[1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 1],
	[1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];*/

let tetriminos = [//7種類×4方向のテトリミノ
	[
		[//I(水色)
			[ 0, 0, 0, 0 ],
			[ 2, 2, 2, 2 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 2, 0 ],
			[ 0, 0, 2, 0 ],
			[ 0, 0, 2, 0 ],
			[ 0, 0, 2, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 2, 2, 2, 2 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 2, 0, 0 ],
			[ 0, 2, 0, 0 ],
			[ 0, 2, 0, 0 ],
			[ 0, 2, 0, 0 ]
		],
	],
	[
		[//O(黄色)
			[ 0, 3, 3, 0 ],
			[ 0, 3, 3, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 3, 3, 0 ],
			[ 0, 3, 3, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 3, 3, 0 ],
			[ 0, 3, 3, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 3, 3, 0 ],
			[ 0, 3, 3, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[//T(紫)
			[ 0, 4, 0, 0 ],
			[ 4, 4, 4, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 4, 0, 0 ],
			[ 0, 4, 4, 0 ],
			[ 0, 4, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 4, 4, 4, 0 ],
			[ 0, 4, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 4, 0, 0 ],
			[ 4, 4, 0, 0 ],
			[ 0, 4, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[//J(青)
			[ 5, 0, 0, 0 ],
			[ 5, 5, 5, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 5, 5, 0 ],
			[ 0, 5, 0, 0 ],
			[ 0, 5, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 5, 5, 5, 0 ],
			[ 0, 0, 5, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 5, 0, 0 ],
			[ 0, 5, 0, 0 ],
			[ 5, 5, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[//L(オレンジ)
			[ 0, 0, 6, 0 ],
			[ 6, 6, 6, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 6, 0, 0 ],
			[ 0, 6, 0, 0 ],
			[ 0, 6, 6, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 6, 6, 6, 0 ],
			[ 6, 0, 0, 0 ]
		],
		[
			[ 6, 6, 0, 0 ],
			[ 0, 6, 0, 0 ],
			[ 0, 6, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[//S(緑)
			[ 0, 7, 7, 0 ],
			[ 7, 7, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 7, 0, 0 ],
			[ 0, 7, 7, 0 ],
			[ 0, 0, 7, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 7, 7, 0 ],
			[ 7, 7, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 7, 0, 0, 0 ],
			[ 7, 7, 0, 0 ],
			[ 0, 7, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[//Z(赤)
			[ 8, 8, 0, 0 ],
			[ 0, 8, 8, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 8, 0 ],
			[ 0, 8, 8, 0 ],
			[ 0, 8, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 8, 8, 0, 0 ],
			[ 0, 8, 8, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 8, 0, 0 ],
			[ 8, 8, 0, 0 ],
			[ 8, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
];
	
let inControlTetrimino=[//操作中のテトリミノ
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ]
];

let nextTetrimino=[//ネクストテトリミノ
	[
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ]
	],
	[
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ]
	],
	[
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ]
	],
	[
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ]
	],
	[
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ]
	],
	[
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ]
	],
];

let currentTetriminoPositionX = 0;//操作中のテトリミノのX座標
let currentTetriminoPositionY = 0;//操作中のテトリミノのY座標
let currentTetriminoAngle=0;//操作中のテトリミノの角度
let currentTetriminoKind=0;//操作中のテトリミノの種類

let gameScore = 0;//得点
let clearLines = 0;//消去ライン数
let gameLevel = 1;//ゲームレベル
let renCount = 0;//連鎖数
let tetris = 0;//4ライン消去回数
let perfectClears = 0;//全消し回数

let currentscreenState = screenState.TITLE;//現在の状態をタイトルに設定

let tetriminoCatalog = [0,1,2,3,4,5,6];//ネクストテトリミノの出現を操作
let sortTetriminoCount = 0;//ネクストテトリミノのカウント
let nextTetriminoKinds = [0,0,0,0,0,0];//ネクストテトリミノの種類を格納

let holdSetFlag = 0;//ホールドが一度でも使用されたらゲームオーバーまで1
let holdChangeFlag = 0;//Holdを使用したらその間連続で交換できないようにする

let holdTetrimino=[//ホールドテトリミノ
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ]
];

let holdTetriminoKind = 0;//ホールドテトリミノの種類

let ghostTetriminoPositionX;//ゴーストテトリミノのX座標
let ghostTetriminoPositionY;//ゴーストテトリミノのY座標

//経過時間
let time = 0;
let hour = 0;
let min = 0;
let min1 = 0;
let min2 = 0;
let sec = 0;
let sec1 = 0;
let sec2 = 0;

let fallTime = 1000;//初期落下速度(ミリ秒)

let eraseCount = 0;//一度に何ライン消去したか
let positionPrintHeight = 0;//フィールドに文字を表示するときの高さの位置
let additionScore = 0;//加算されるゲームスコア
let allClearFlag = 0;//全消し判定
let mysteriousAddPoints = 1;//謎の加算倍率

let tmpPlayField= [//リセットする際に使用する
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let tmpHoldTetrimino=[
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ]
];

//let scoreRanking = [123456789,12345678,1234567,123456,12345,1234,123,12,1,0,0];
let scoreRanking = [0,0,0,0,0,0,0,0,0,0,0];

let hiddenCommandTetriminos = [//特殊テトリミノ
	[
		[
			[ 2, 0, 0, 0 ],
			[ 2, 2, 2, 2 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 2, 2, 0 ],
			[ 0, 2, 0, 0 ],
			[ 0, 2, 0, 0 ],
			[ 0, 2, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 2, 2, 2, 2 ],
			[ 0, 0, 0, 2 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 2, 0, 0 ],
			[ 0, 2, 0, 0 ],
			[ 0, 2, 0, 0 ],
			[ 2, 2, 0, 0 ]
		],
	],
	[
		[
			[ 3, 3, 3, 0 ],
			[ 3, 3, 3, 0 ],
			[ 3, 3, 3, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 3, 3, 3, 3 ],
			[ 3, 3, 3, 3 ],
			[ 3, 3, 3, 3 ],
			[ 3, 3, 3, 3 ]
		],
		[
			[ 3, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 3, 3, 0, 0 ],
			[ 3, 3, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[
			[ 4, 4, 4, 0 ],
			[ 4, 0, 0, 0 ],
			[ 4, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 4, 4, 4, 0 ],
			[ 0, 0, 4, 0 ],
			[ 0, 0, 4, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 4, 0 ],
			[ 0, 0, 4, 0 ],
			[ 4, 4, 4, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 4, 0, 0, 0 ],
			[ 4, 0, 0, 0 ],
			[ 4, 4, 4, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[
			[ 0, 0, 0, 5 ],
			[ 5, 5, 5, 5 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 5, 0, 0 ],
			[ 0, 5, 0, 0 ],
			[ 0, 5, 0, 0 ],
			[ 0, 5, 5, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 5, 5, 5, 5 ],
			[ 5, 0, 0, 0 ]
		],
		[
			[ 5, 5, 0, 0 ],
			[ 0, 5, 0, 0 ],
			[ 0, 5, 0, 0 ],
			[ 0, 5, 0, 0 ]
		],
	],
	[
		[
			[ 0, 6, 0, 0 ],
			[ 6, 6, 6, 0 ],
			[ 0, 6, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 6, 0, 0 ],
			[ 6, 6, 6, 0 ],
			[ 0, 6, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 6, 0, 0 ],
			[ 6, 6, 6, 0 ],
			[ 0, 6, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 6, 0, 0 ],
			[ 6, 6, 6, 0 ],
			[ 0, 6, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[
			[ 7, 7, 7, 0 ],
			[ 0, 7, 0, 0 ],
			[ 0, 7, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 7, 0 ],
			[ 7, 7, 7, 0 ],
			[ 0, 0, 7, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 7, 0, 0 ],
			[ 0, 7, 0, 0 ],
			[ 7, 7, 7, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 7, 0, 0, 0 ],
			[ 7, 7, 7, 0 ],
			[ 7, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[
			[ 0, 8, 8, 0 ],
			[ 0, 8, 8, 0 ],
			[ 0, 8, 8, 0 ],
			[ 0, 8, 8, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 8, 8, 8, 8 ],
			[ 8, 8, 8, 8 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 8, 0, 0 ],
			[ 0, 8, 0, 0 ],
			[ 0, 8, 0, 0 ],
			[ 0, 8, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 8, 8, 8, 8 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
];

let tmpTetriminos = [
	[
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
];

//隠しコマンド
let hiddenCommand_rotateDraw_Counter = 0;
let hiddenCommand_rotateDraw_Flag = 0;

let hiddenCommand_halfSecretDraw_Counter = 0;
let hiddenCommand_halfSecretDraw_Flag = 0;

let hiddenCommand_gameLevelUp_Counter = 0;

let hiddenCommand_fieldClear_Counter = 0;

let hiddenCommand_changeTetrimino_Counter = 0;
let hiddenCommand_changeTetrimino_Flag = 0;

let hiddenCommand_mysteriousAddPoints_Counter = 0;
let hiddenCommand_mysteriousAddPoints_Flag = 0;

let forcedTerminationFlag = 0;//強制終了

/*----------------------------------------------------------------------------------------------------*/

function init(){
	//clearInterval(mainLoopTimer);

	blockSize = BLOCK_SIZE;

	// キャンバスの設定
	canvasGame = document.getElementById("canvasGame");
	canvasGame.width = SCREEN_WIDTH;
	canvasGame.height = SCREEN_HEIGHT;
	gameWindow = canvasGame.getContext("2d");

	canvasTime = document.getElementById("canvasTime");
	canvasTime.width = SCREEN_WIDTH;
	canvasTime.height = TIME_FIELD_HEIGHT;
	timeWindow = canvasTime.getContext("2d");

	canvasAll = document.getElementById("canvasAll");
	canvasAll.width = SCREEN_WIDTH;
	canvasAll.height = SCREEN_HEIGHT_OTHER;
	allWindow = canvasAll.getContext("2d");
}

function newGame(){
	//clearInterval(mainLoopTimer);
	generateTetrimino(FALL_BASE_X, FALL_BASE_Y,0);
}

function copy(){
	let i,j,h,w;
    for (h = 0; h < FIELD_HEIGHT; h++) {
        for (w = 0; w < FIELD_WIDTH; w++) {
            tmpPlayField[h][w] = playField[h][w];
        }
    }
    for (h = 0; h < TETRIMINO_HEIGHT; h++) {
        for (w = 0; w < TETRIMINO_WIDTH; w++) {
            tmpHoldTetrimino[h][w] = holdTetrimino[h][w];
        }
    }

	for (i = 0; i < TETRIMINO_KINDS; i++) {
        for (j = 0; j < TETRIMINO_ANGLES; j++) {
            for (h = 0; h < TETRIMINO_HEIGHT; h++) {
				for (w = 0; w < TETRIMINO_WIDTH; w++) {
					tmpTetriminos[i][j][h][w] = tetriminos[i][j][h][w];
				}
			}
		}
    }	
}

function reset(){
    let h,w;
    holdSetFlag = 0;
    holdChangeFlag = 0;
    holdTetriminoKind = 0;
    currentTetriminoAngle=0;
    currentTetriminoKind=0;
    currentTetriminoPositionX = 0;
    currentTetriminoPositionY = 0;
    gameScore = 0;
    clearLines = 0;
    gameLevel = 1;
    time = 0;
	hour = 0;
	min = 0;
	min1 = 0;
	min2 = 0;
	sec = 0;
	sec1 = 0;
	sec2 = 0;
    fallTime = 1000;
    sortTetriminoCount = 0;
    renCount = 0;
	perfectClears = 0;
	tetris = 0;

	eraseCount = 0;
	positionPrintHeight = 0;
	additionScore = 0;
	allClearFlag = 0;
	mysteriousAddPoints = 1;

	forcedTerminationFlag = 0;

	hiddenCommand_rotateDraw_Counter = 0;
	hiddenCommand_rotateDraw_Flag = 0;
	hiddenCommand_halfSecretDraw_Counter = 0;
	hiddenCommand_halfSecretDraw_Flag = 0;
	hiddenCommand_gameLevelUp_Counter = 0;
	hiddenCommand_fieldClear_Counter = 0;
	hiddenCommand_changeTetrimino_Counter = 0;
	hiddenCommand_changeTetrimino_Flag = 0;
	hiddenCommand_mysteriousAddPoints_Counter = 0;
	hiddenCommand_mysteriousAddPoints_Flag = 0;
    //tetriminoCatalog = [0,1,2,3,4,5,6];
	//nextTetriminoKinds = [0,0,0,0,0,0];
    for (h = 0; h < FIELD_HEIGHT; h++) {
        for (w = 0; w < FIELD_WIDTH; w++) {
            playField[h][w] = tmpPlayField[h][w];
        }
    }
    for (h = 0; h < TETRIMINO_HEIGHT; h++) {
        for (w = 0; w < TETRIMINO_WIDTH; w++) {
            holdTetrimino[h][w] = tmpHoldTetrimino[h][w];
        }
    }
	for (i = 0; i < TETRIMINO_KINDS; i++) {
        for (j = 0; j < TETRIMINO_ANGLES; j++) {
            for (h = 0; h < TETRIMINO_HEIGHT; h++) {
				for (w = 0; w < TETRIMINO_WIDTH; w++) {
					tetriminos[i][j][h][w] = tmpTetriminos[i][j][h][w];
				}
			}
		}
    }
}

function changeTetrimino(){
	let i,j,h,w;
	for (i = 0; i < TETRIMINO_KINDS; i++) {
        for (j = 0; j < TETRIMINO_ANGLES; j++) {
            for (h = 0; h < TETRIMINO_HEIGHT; h++) {
				for (w = 0; w < TETRIMINO_WIDTH; w++) {
					tetriminos[i][j][h][w] = hiddenCommandTetriminos[i][j][h][w];
				}
			}
		}
    }
}

function compareScore(a,b){
	return b - a;
}

function updateRanking(){
	scoreRanking[10] = gameScore;
	scoreRanking.sort(compareScore);
}

function clearAllWindow(){
	allWindow.fillStyle = BACK_COLOR;//背景色
	allWindow.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT_OTHER);//キャンバスを背景色で塗りつぶす

};

function clearTimeWindow(){
	timeWindow.fillStyle = BACK_COLOR;
	timeWindow.fillRect(0, 0, SCREEN_WIDTH, TIME_FIELD_HEIGHT);

};

function clearGameWindow(){
	gameWindow.fillStyle = BACK_COLOR;
	gameWindow.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

};

function clearWindowTime(){
	timeWindow.fillStyle = BACK_COLOR;
	timeWindow.fillRect(0, 0, SCREEN_WIDTH, BLOCK_SIZE*3);
}

function elapsedTime() {//経過時間0:00:00を表示する
	clearWindowTime();
	timeWindow.fillStyle=COLOR_BLACK;
	timeWindow.font="20px serif";
	timeWindow.fillText(hour + ":" + min1 + min2 + ":" + sec1 + sec2,363,55);
}

function timePlus(){
	++time;//1秒加算
	timeWindow.fillStyle="black";
	timeWindow.font="20px serif";

	hour = Math.floor(time / 3600);//時間(経過秒数÷3600秒)
	min = Math.floor((time % 3600) / 60);//分(時間の余り÷60秒)
	min1 = Math.floor(min / 10);//分の10の位
	min2 = min % 10;//分の1の位
	sec = time % 60;//秒(経過秒数÷60秒の余り)
	sec1 = Math.floor(sec / 10);//秒の10の位
	sec2 = sec % 10;//秒の1の位
	
	clearWindowTime();
	timeWindow.fillStyle=COLOR_BLACK;
	timeWindow.fillText(hour + ":" + min1 + min2 + ":" + sec1 + sec2,363,55);
}

/*----------------------------------------------------------------------------------------------------*/

function setNewControlTetrimino(kind) {
    let i,h,w;
    
    for (h = 0; h < TETRIMINO_HEIGHT; h++) {
        for (w = 0; w < TETRIMINO_WIDTH; w++) {
            inControlTetrimino[h][w] = nextTetrimino[0][h][w];
        }
    }
    
    for (i = 1; i < TETRIMINO_NEXTKINDS; i++) {
        for (h = 0; h < TETRIMINO_HEIGHT; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                nextTetrimino[i-1][h][w] = nextTetrimino[i][h][w];
            }
        }
    }
    
    for (h = 0; h < TETRIMINO_HEIGHT; h++) {
        for (w = 0; w < TETRIMINO_WIDTH; w++) {
            nextTetrimino[TETRIMINO_NEXTKINDS-1][h][w] = tetriminos[kind][currentTetriminoAngle][h][w];//4×4、選ばれたテトリミノをセット
        }
    }
    
    currentTetriminoKind = nextTetriminoKinds[0];
    for(i = 1;i < TETRIMINO_NEXTKINDS; i++){
        nextTetriminoKinds[i-1] = nextTetriminoKinds[i];
    }
    nextTetriminoKinds[TETRIMINO_NEXTKINDS - 1] = kind;
}

function shuffle(array,size){
    let i,j,tmp;
    for(i =0;i < size; i++){
        j = Math.floor(Math.random()*7);
        tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
}

function generateTetrimino(x,y,nextFlag){
    let i;
    currentTetriminoAngle=0;
    currentTetriminoPositionX = x;
    currentTetriminoPositionY = y;
    
    if(nextFlag == 0){
        shuffle(tetriminoCatalog,TETRIMINO_KINDS);
        for(i = 0;i < TETRIMINO_NEXTKINDS; i++){
            currentTetriminoKind = tetriminoCatalog[sortTetriminoCount];
            sortTetriminoCount++;
            setNewControlTetrimino(currentTetriminoKind);
        }
    }
    if(sortTetriminoCount == TETRIMINO_KINDS){
        shuffle(tetriminoCatalog,TETRIMINO_KINDS);
        sortTetriminoCount = 0;
    }
    currentTetriminoKind = tetriminoCatalog[sortTetriminoCount];
    sortTetriminoCount++;
    setNewControlTetrimino(currentTetriminoKind);

}

function setTetrimino(baseX,baseY,setBuf) {
    let h,w;

	ghostTetriminoPositionX = baseX;
    ghostTetriminoPositionY = baseY;
    
	//こっちのゴーストテトリミノを先にフィールドに設定してあげないと
	//isCollisionで衝突が起こりバグが発生する。
	//つまり、isColossion関数の設計上、FREEの段階で先にゴーストテトリミノを設定してあげないといけない。
    is_fallen = isCollision(ghostTetriminoPositionX,ghostTetriminoPositionY + 1, setBuf);

    while(is_fallen == 0){
        ghostTetriminoPositionY++;
        is_fallen = isCollision(ghostTetriminoPositionX,ghostTetriminoPositionY + 1, setBuf);
    }
    
    for (h = 0; h < TETRIMINO_HEIGHT; h++) {
        for (w = 0; w < TETRIMINO_WIDTH; w++) {
            switch(setBuf[h][w]){
				case blockType.CONTROL_LIGHTBLUE:
					playField[ghostTetriminoPositionY+h][ghostTetriminoPositionX+w] = blockType.FALL_POSITION_LIGHTBLUE;
					break;
				case blockType.CONTROL_YELLOW:
					playField[ghostTetriminoPositionY+h][ghostTetriminoPositionX+w] = blockType.FALL_POSITION_YELLOW;
					break;
				case blockType.CONTROL_PURPLE:
					playField[ghostTetriminoPositionY+h][ghostTetriminoPositionX+w] = blockType.FALL_POSITION_PURPLE;
					break;
				case blockType.CONTROL_BLUE:
					playField[ghostTetriminoPositionY+h][ghostTetriminoPositionX+w] = blockType.FALL_POSITION_BLUE;
					break;
				case blockType.CONTROL_ORANGE:
					playField[ghostTetriminoPositionY+h][ghostTetriminoPositionX+w] = blockType.FALL_POSITION_ORANGE;
					break;
				case blockType.CONTROL_GREEN:
					playField[ghostTetriminoPositionY+h][ghostTetriminoPositionX+w] = blockType.FALL_POSITION_GREEN;
					break;
				case blockType.CONTROL_RED:
					playField[ghostTetriminoPositionY+h][ghostTetriminoPositionX+w] = blockType.FALL_POSITION_RED;
					break;
            }
        }
    }

    for (h = 0; h < TETRIMINO_HEIGHT; h++) {
        for (w = 0; w < TETRIMINO_WIDTH; w++) {
            if (setBuf[h][w] == blockType.CONTROL_LIGHTBLUE ||
				setBuf[h][w] == blockType.CONTROL_YELLOW ||
				setBuf[h][w] == blockType.CONTROL_PURPLE ||
				setBuf[h][w] == blockType.CONTROL_BLUE ||
				setBuf[h][w] == blockType.CONTROL_ORANGE ||
				setBuf[h][w] == blockType.CONTROL_GREEN ||
				setBuf[h][w] == blockType.CONTROL_RED) {//もし4×4のうち、描画するマスならば
                playField[baseY + h][baseX + w] = setBuf[h][w];//baseY列baseY行ずらしたところに配置
            }//例えば、最初縦4本のテトリミノの場合、最後の固定はplayField[16+0][1+0]=setBuf[0][0]
        }
    }

	
}

function unsetTetrimino(baseX,baseY,setBuf) {
	let h,w;
    for (h = 0; h < TETRIMINO_HEIGHT; h++) {
		for (w = 0; w < TETRIMINO_WIDTH; w++) {
			if (setBuf[h][w] == blockType.CONTROL_LIGHTBLUE ||
				setBuf[h][w] == blockType.CONTROL_YELLOW ||
				setBuf[h][w] == blockType.CONTROL_PURPLE ||
				setBuf[h][w] == blockType.CONTROL_BLUE ||
				setBuf[h][w] == blockType.CONTROL_ORANGE ||
				setBuf[h][w] == blockType.CONTROL_GREEN ||
				setBuf[h][w] == blockType.CONTROL_RED) {//もし4×4のうち、描画されていて消去するマスならば
				playField[baseY + h][baseX + w] = blockType.FREE;//baseY列baseY行ずらしたところを削除
			    //この時点では、まだ描画の関数が実行されておらず、FREEに変更しただけなので、画面にテトリミノが残っている
			}
		}
	}
	for (h = 0; h < FIELD_HEIGHT; h++) {
        for (w = 0; w < FIELD_WIDTH; w++) {
            if (playField[h][w] == blockType.FALL_POSITION_LIGHTBLUE
				|| playField[h][w] == blockType.FALL_POSITION_YELLOW
				|| playField[h][w] == blockType.FALL_POSITION_PURPLE
				|| playField[h][w] == blockType.FALL_POSITION_BLUE
				|| playField[h][w] == blockType.FALL_POSITION_ORANGE
				|| playField[h][w] == blockType.FALL_POSITION_GREEN
				|| playField[h][w] == blockType.FALL_POSITION_RED){
                playField[h][w] = blockType.FREE;
            }
        }
    }
}

function isCollision(baseX,baseY,setBuf) {
	let h,w;
    for (h = 0; h < TETRIMINO_HEIGHT; h++) {
		for (w = 0; w < TETRIMINO_WIDTH; w++) {//4×4回
			if (setBuf[h][w] == blockType.CONTROL_LIGHTBLUE
                || setBuf[h][w] == blockType.CONTROL_YELLOW
                || setBuf[h][w] == blockType.CONTROL_PURPLE
                || setBuf[h][w] == blockType.CONTROL_BLUE
                || setBuf[h][w] == blockType.CONTROL_ORANGE
                || setBuf[h][w] == blockType.CONTROL_GREEN
                || setBuf[h][w] == blockType.CONTROL_RED) {//もし4×4のうち、描画されていているマスならば
				if (playField[baseY + h][baseX + w] != blockType.FREE) {//移動させたい先がFREEでないのならば
					return 1;//移動できない
				}
			}
		}
	}
	return 0;//移動できる
}

function moveInControlTetrimino(baseX,baseY) {
	//壁に衝突しなければ座標を変更する
	if (isCollision(baseX, baseY, inControlTetrimino) == 0) {//もし移動できるのならば
		currentTetriminoPositionX = baseX;//指定の分それぞれ座標をずらす
		currentTetriminoPositionY = baseY;
		return 1;
	}
	return 0;
}

function fixTetrimino() {
    let h,w;
	//操作中のテトリミノをフィールドへ設定する
	setTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, inControlTetrimino);

	//フィールドの操作中のテトリミノを固定
	for (h = 0; h < TETRIMINO_HEIGHT; h++) {
		for (w = 0; w < TETRIMINO_WIDTH; w++) {
			let ph = currentTetriminoPositionY + h;
			let pw = currentTetriminoPositionX + w;

			if ((0 < ph && ph < FIELD_HEIGHT - 1) &&//横12マス×縦21マスのうち、上下端1行でない
				(0 < pw && pw < FIELD_WIDTH - 1)) {//かつ左右端1行でないのならば

					if (playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] == blockType.CONTROL_LIGHTBLUE) {
						playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] = blockType.FIX_LIGHTBLUE;
					}
					if (playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] == blockType.CONTROL_YELLOW) {
						playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] = blockType.FIX_YELLOW;
					}
					if (playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] == blockType.CONTROL_PURPLE) {
						playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] = blockType.FIX_PURPLE;
					}
					if (playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] == blockType.CONTROL_BLUE) {
						playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] = blockType.FIX_BLUE;
					}
					if (playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] == blockType.CONTROL_ORANGE) {
						playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] = blockType.FIX_ORANGE;
					}
					if (playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] == blockType.CONTROL_GREEN) {
						playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] = blockType.FIX_GREEN;
					}
					if (playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] == blockType.CONTROL_RED) {
						playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] = blockType.FIX_RED;
					}
			}
		}
	}
}

function rotateInControlTetrimino(isClockwise) {
    let buf = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    let h,w;
    let baseX,baseY;
    //回転後のテトリミノの配置を一時バッファへ入れる
    if (isClockwise == 1) {//時計回り
        if(currentTetriminoAngle!=TETRIMINO_ANGLES-1){
            currentTetriminoAngle++;
        }else{
            currentTetriminoAngle=0;
        }
        
        for (h = 0; h < TETRIMINO_HEIGHT; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                buf[h][w] = tetriminos[currentTetriminoKind][currentTetriminoAngle][h][w];
            }
        }
    } else {//反時計回り
        if(currentTetriminoAngle!=0){
            currentTetriminoAngle--;
        }else{
            currentTetriminoAngle=TETRIMINO_ANGLES-1;
        }
        
        for (h = 0; h < TETRIMINO_HEIGHT; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                buf[h][w] = tetriminos[currentTetriminoKind][currentTetriminoAngle][h][w];
            }
        }
    }
    
    //衝突しなければバッファを置き換える
    baseX = currentTetriminoPositionX;
    baseY = currentTetriminoPositionY;
    if (isCollision(baseX, baseY, buf) == 0) {
        for (h = 0; h < TETRIMINO_HEIGHT; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                inControlTetrimino[h][w] = buf[h][w];
            }
        }
    }
}

function isCompleteLine(line) {
	let w;
    for (w = 1; w < FIELD_WIDTH - 1; w++) {
		//固定と壁以外が見つかった
		if (playField[line][w] != blockType.WALL
            && playField[line][w] != blockType.FIX_LIGHTBLUE
            && playField[line][w] != blockType.FIX_YELLOW
            && playField[line][w] != blockType.FIX_PURPLE
            && playField[line][w] != blockType.FIX_BLUE
            && playField[line][w] != blockType.FIX_ORANGE
            && playField[line][w] != blockType.FIX_GREEN
            && playField[line][w] != blockType.FIX_RED) {//もし埋まっていないますがあったら
			return 0;//1行埋まっていない
		}
	}
	return 1;//1行埋まっている
}

function eraseLine(line) {
	let w;
    for (w = 1; w < FIELD_WIDTH - 1; w++) {
		//固定されたテトリミノを削除(FREEへ変更)
		if(playField[line][w] != blockType.FIX_LIGHTBLUE
            || playField[line][w] != blockType.FIX_YELLOW
            || playField[line][w] != blockType.FIX_PURPLE
            || playField[line][w] != blockType.FIX_BLUE
            || playField[line][w] != blockType.FIX_ORANGE
            || playField[line][w] != blockType.FIX_GREEN
            || playField[line][w] != blockType.FIX_RED) {
			playField[line][w] = blockType.FREE;
		}
	}
}

function compaction(line) {
    let h,w;
	for (h = line; h > 1; h--) {
		for (w = 0; w < FIELD_WIDTH; w++) {
			playField[h][w] = playField[h-1][w];
		}
	}
	//一番上はFREEで詰める
	eraseLine(1);
}

function allClearCheckTetrimino(){
    let h,w;
	
    for (h = 1; h < FIELD_HEIGHT -1; h++) {
        for (w = 1; w < FIELD_WIDTH -1; w++) {
            if (playField[h][w] != blockType.FREE) {
                return 0;
            }
        }
    }
	perfectClears++;
	allClearFlag = 1;
    return 1;
}

function scoreUp(count,levelUpFlag){
    let addition = 1;
	let hiddenCommandAddition = 0;
	let randnum = 0;
    if(allClearCheckTetrimino(1)){//全消し判定
        addition = 10;
    }

	if(hiddenCommand_rotateDraw_Flag == 1){
		hiddenCommandAddition = hiddenCommandAddition + 10;
	}
	if(hiddenCommand_halfSecretDraw_Flag == 1){
		hiddenCommandAddition = hiddenCommandAddition + 10;
	}//2つともNOなら1に変更
	if(hiddenCommandAddition == 0){
		hiddenCommandAddition = 1;
	}

	if(hiddenCommand_mysteriousAddPoints_Flag == 1){
		randnum = Math.floor(Math.random()*10000);//0～9999
		if(randnum <= 3000){
			mysteriousAddPoints = 1;//謎の加算なし
		}else if(randnum <= 6000){
			mysteriousAddPoints = 1.2;
		}else if(randnum <= 8000){
			mysteriousAddPoints = 1.5;
		}else if(randnum <= 9000){
			mysteriousAddPoints = 2;
		}else if(randnum <= 9500){
			mysteriousAddPoints = 2.5;
		}else if(randnum <= 9800){
			mysteriousAddPoints = 3;
		}else if(randnum <= 9900){
			mysteriousAddPoints = 4;
		}else if(randnum <= 9950){
			mysteriousAddPoints = 10;
		}else if(randnum <= 9980){
			mysteriousAddPoints = 50;
		}else if(randnum <= 9990){
			mysteriousAddPoints = 100;
		}else if(randnum <= 9995){
			mysteriousAddPoints = 300;
		}else if(randnum <= 9998){
			mysteriousAddPoints = 500;
		}else if(randnum == 9999){
			mysteriousAddPoints = 1000;//0.01%の確率で1000倍
		}
	}

    switch(count){//素点×全消し×レベル×連鎖数*各隠しコマンド加点*謎の倍率
        case 1:
            gameScore += Math.round(100 * addition * (gameLevel - levelUpFlag) * renCount * hiddenCommandAddition * mysteriousAddPoints);
			additionScore = Math.round(100 * addition * (gameLevel - levelUpFlag) * renCount * hiddenCommandAddition * mysteriousAddPoints);
            break;
        case 2:
            gameScore += Math.round(400 * addition * (gameLevel - levelUpFlag) * renCount * hiddenCommandAddition * mysteriousAddPoints);
			additionScore = Math.round(400 * addition * (gameLevel - levelUpFlag) * renCount * hiddenCommandAddition * mysteriousAddPoints);
            break;
        case 3:
            gameScore += Math.round(900 * addition * (gameLevel - levelUpFlag) * renCount * hiddenCommandAddition * mysteriousAddPoints);
			additionScore = Math.round(900 * addition * (gameLevel - levelUpFlag) * renCount * hiddenCommandAddition * mysteriousAddPoints);
            break;
        case 4:
            gameScore += Math.round(1600 * addition * (gameLevel - levelUpFlag) * renCount * hiddenCommandAddition * mysteriousAddPoints);
			additionScore = Math.round(1600 * addition * (gameLevel - levelUpFlag) * renCount * hiddenCommandAddition * mysteriousAddPoints);
            break;
    }
}

function fallSpeedUp(){
    switch(gameLevel){
        case 2:
            fallTime = 800;
            break;
        case 3:
            fallTime = 600;
            break;
        case 4:
            fallTime = 400;
            break;
        case 5:
            fallTime = 350;
            break;
        case 6:
            fallTime = 300;
            break;
        case 7:
            fallTime = 250;
            break;
        case 8:
            fallTime = 200;
            break;
        case 9:
            fallTime = 150;
            break;
        case 10:
            fallTime = 100;//0.1秒
            break;
        case 11:
            fallTime = 80;
            break;
        case 12:
            fallTime = 60;
            break;
        case 13:
            fallTime = 40;
            break;
        case 14:
            fallTime = 20;
            break;
        case 15:
            fallTime = 10;//0.01秒
            break;
        default:
            fallTime = 10;
    }
	clearInterval(mainLoopTimer);
	mainLoopTimer = setInterval( mainLoop, fallTime );
}

function levelUp(){
    if(clearLines != 0 && clearLines % 10 == 0){
        gameLevel++;
        fallSpeedUp();
        return 1;
    }
    return 0;
}

function eraseCompleteLine() {
    let h,count=0,levelUpFlag = 0,renFlag = 0,erasePosition = 0;
    //一行上に追加したので壁の判定で引っかからないように0でなく1から、一番下も判定しなくていいので-1
    for (h = 1; h < FIELD_HEIGHT-1; h++) {
        if (isCompleteLine(h)) {//1行埋まっているならば(1が返されたならば)
            eraseLine(h);
            compaction(h);
            count++;
            clearLines++;
            renFlag = 1;//連鎖
            if(levelUp() == 1){
                levelUpFlag = 1;
            }
			erasePosition = h;
        }
    }
    if(renFlag == 1){
        renCount++;
    }else{
        renCount = 0;
    }

    scoreUp(count,levelUpFlag);
	
	if(count == 4){
		tetris++;
	}
	if(count >= 1){
		eraseCount = count;
		positionPrintHeight = erasePosition - count;
	}
}

function setHoldTetrimino(x,y){
    currentTetriminoAngle = 0;
    currentTetriminoPositionX = x;
    currentTetriminoPositionY = y;
}

function holdControlTetrimino(){
    let h, w;
    let buf = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    let holdTmp;
    
    if(holdSetFlag == 0){
        for (h = 0; h < TETRIMINO_HEIGHT; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                holdTetrimino[h][w] = tetriminos[currentTetriminoKind][0][h][w];
            }
        }
        holdTetriminoKind = currentTetriminoKind;
        unsetTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, inControlTetrimino);
        holdSetFlag = 1;
        generateTetrimino(FALL_BASE_X, FALL_BASE_Y,1);
    }else{
        for (h = 0; h < TETRIMINO_HEIGHT; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                buf[h][w] = tetriminos[currentTetriminoKind][0][h][w];
                inControlTetrimino[h][w] = holdTetrimino[h][w];
                holdTetrimino[h][w] = buf[h][w];
            }
        }
        holdTmp = currentTetriminoKind;
        currentTetriminoKind = holdTetriminoKind;
        holdTetriminoKind = holdTmp;
        
        setHoldTetrimino(FALL_BASE_X, FALL_BASE_Y);
    }
}

function fieldClear(){
	let h,w;
    for (h = 1; h < FIELD_HEIGHT -1; h++) {
        for (w = 1; w < FIELD_WIDTH -1; w++) {
            playField[h][w] = tmpPlayField[h][w];
        }
    }
}

async function deleteFlowField(){
	let h,w;
	if(forcedTerminationFlag == 0){
		for (h = 1; h < FIELD_HEIGHT -1; h++) {
			await sleep(50);
			for (w = 1; w < FIELD_WIDTH -1; w++) {
				playField[h][w] = blockType.FREE;
			}
			drawField();
			if(hiddenCommand_changeTetrimino_Flag == 0){
				drawFieldNext();
			}else if(hiddenCommand_changeTetrimino_Flag == 1){
				drawFieldNextBig();
			}
			drawFieldHold();
			drawScore();
			drawHighScore();
			drawClearLines();
			drawGameLevels();
			drawRens();
			drawTetris();
			drawPerfectClear();
		}
	}
	updateRanking();
	drawGameOverScreen();
}
/*----------------------------------------------------------------------------------------------------*/

function drawField(){
	clearGameWindow();
	let fallFlag = 0;
	for(let i=0; i<FIELD_HEIGHT; i++){
		for(let j=0; j<FIELD_WIDTH; j++){
			switch(playField[i][j]){
				case blockType.FREE:
					gameWindow.fillStyle = COLOR_WHITE;
					break;
				case blockType.WALL:
					gameWindow.fillStyle = COLOR_BLACK;
					break;
				case blockType.CONTROL_LIGHTBLUE:
				case blockType.FIX_LIGHTBLUE:
					gameWindow.fillStyle = COLOR_LIGHTBLUE;
					break;
				case blockType.CONTROL_YELLOW:
				case blockType.FIX_YELLOW:
					gameWindow.fillStyle = COLOR_YELLOW;
					break;
				case blockType.CONTROL_PURPLE:
				case blockType.FIX_PURPLE:
					gameWindow.fillStyle = COLOR_PURPLE;
					break;
				case blockType.CONTROL_BLUE:
				case blockType.FIX_BLUE:
					gameWindow.fillStyle = COLOR_BLUE;
					break;
				case blockType.CONTROL_ORANGE:
				case blockType.FIX_ORANGE:
					gameWindow.fillStyle = COLOR_ORANGE;
					break;
				case blockType.CONTROL_GREEN:
				case blockType.FIX_GREEN:
					gameWindow.fillStyle = COLOR_GREEN;
					break;
				case blockType.CONTROL_RED:
				case blockType.FIX_RED:
					gameWindow.fillStyle = COLOR_RED;
					break;
				case blockType.FALL_POSITION_LIGHTBLUE:
					gameWindow.fillStyle = COLOR_LIGHTBLUE_FALL;
					fallFlag = 1;
					break;
				case blockType.FALL_POSITION_YELLOW:
					gameWindow.fillStyle = COLOR_YELLOW_FALL;
					fallFlag = 1;
					break;
				case blockType.FALL_POSITION_PURPLE:
					gameWindow.fillStyle = COLOR_PURPLE_FALL;
					fallFlag = 1;
					break;
				case blockType.FALL_POSITION_BLUE:
					gameWindow.fillStyle = COLOR_BLUE_FALL;
					fallFlag = 1;
					break;
				case blockType.FALL_POSITION_ORANGE:
					gameWindow.fillStyle = COLOR_ORANGE_FALL;
					fallFlag = 1;
					break;
				case blockType.FALL_POSITION_GREEN:
					gameWindow.fillStyle = COLOR_GREEN_FALL;
					fallFlag = 1;
					break;
				case blockType.FALL_POSITION_RED:
					gameWindow.fillStyle = COLOR_RED_FALL;
					fallFlag = 1;
					break;
				//default:		// 重なったときの色
					//g.fillStyle = ERROR_COLOR;
			}
			if(hiddenCommand_rotateDraw_Flag == 0){
				gameWindow.fillRect(j*blockSize + LEFT_FIELD_WIDTH, i*blockSize+ blockSize, blockSize-1, blockSize-1);//1引いて隙間をつくる
			}else if(hiddenCommand_rotateDraw_Flag == 1){
				//フィールドを反転させて表示させる
				gameWindow.fillRect((FIELD_WIDTH - j - 1) * blockSize + LEFT_FIELD_WIDTH, (FIELD_HEIGHT - i - 1) * blockSize + blockSize, blockSize-1, blockSize-1);
			}

			if(hiddenCommand_halfSecretDraw_Flag== 1){
				if(hiddenCommand_rotateDraw_Flag == 0){
					if(i >= FIELD_HEIGHT / 2 && playField[i][j] != blockType.WALL){
						gameWindow.fillStyle = COLOR_GRAY_HALFSECRETDRAW;
						gameWindow.fillRect(j*blockSize + LEFT_FIELD_WIDTH, i*blockSize+ blockSize, blockSize-1, blockSize-1);

					}
				}else if(hiddenCommand_rotateDraw_Flag == 1){
					if(i >= FIELD_HEIGHT / 2 && playField[i][j] != blockType.WALL){
						gameWindow.fillStyle = COLOR_GRAY_HALFSECRETDRAW;
						gameWindow.fillRect((FIELD_WIDTH - j - 1) * blockSize + LEFT_FIELD_WIDTH, (FIELD_HEIGHT - i - 1) * blockSize + blockSize, blockSize-1, blockSize-1);

					}
				}
				
			}
			/*
			if(fallFlag == 1){
				g.fillStyle = COLOR_BLACK;
				g.strokeRect(j*bs + LEFT_FIELD_WIDTH, i*bs+4*bs, bs-1, bs-1);
				fallFlag = 0;
			}*/
		}
	}
}

function drawFieldNext(){
	let i,h,w,height = 0;
	gameWindow.fillStyle="black";
	gameWindow.font="20px serif";
	gameWindow.fillText("NEXT",475,42);

	for(i = 0; i < TETRIMINO_NEXTKINDS; i++){
        for (h = 0; h < TETRIMINO_HEIGHT - 2; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                gameWindow.fillStyle = COLOR_BLACK;
				gameWindow.fillRect(w*blockSize + BLOCK_SIZE * FIELD_WIDTH + LEFT_FIELD_WIDTH + blockSize, h*blockSize+height + 2*blockSize, blockSize-1, blockSize-1); 
            }
        }
        height = height + (3*blockSize);
    }
	height = 0;
	for(i = 0; i < TETRIMINO_NEXTKINDS; i++){
        for (h = 0; h < TETRIMINO_HEIGHT - 2; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
				switch(nextTetrimino[i][h][w]){
					case blockType.CONTROL_LIGHTBLUE:
						gameWindow.fillStyle = COLOR_LIGHTBLUE;
						break;
					case blockType.CONTROL_YELLOW:
						gameWindow.fillStyle = COLOR_YELLOW;
						break;
					case blockType.CONTROL_PURPLE:
						gameWindow.fillStyle = COLOR_PURPLE;
						break;
					case blockType.CONTROL_BLUE:
						gameWindow.fillStyle = COLOR_BLUE;
						break;
					case blockType.CONTROL_ORANGE:
						gameWindow.fillStyle = COLOR_ORANGE;
						break;
					case blockType.CONTROL_GREEN:
						gameWindow.fillStyle = COLOR_GREEN;
						break;
					case blockType.CONTROL_RED:
						gameWindow.fillStyle = COLOR_RED;
						break;
					default:
						gameWindow.fillStyle = COLOR_BLACK;
				}
				gameWindow.fillRect(w*blockSize + BLOCK_SIZE * FIELD_WIDTH + LEFT_FIELD_WIDTH + blockSize, h*blockSize+height + 2*blockSize, blockSize-1, blockSize-1); 
			}
		}
		height = height + (3*blockSize);
	}
}

function drawFieldNextBig(){
	let i,h,w,height = 0;
	gameWindow.fillStyle="black";
	gameWindow.font="20px serif";
	gameWindow.fillText("NEXT",475,42);

	for(i = 0; i < TETRIMINO_NEXTKINDS - 2; i++){
        for (h = 0; h < TETRIMINO_HEIGHT; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                gameWindow.fillStyle = COLOR_BLACK;
				gameWindow.fillRect(w*blockSize + BLOCK_SIZE * FIELD_WIDTH + LEFT_FIELD_WIDTH + blockSize, h*blockSize+height + 2*blockSize, blockSize-1, blockSize-1); 
            }
        }
        height = height + (5*blockSize);
    }
	height = 0;
	for(i = 0; i < TETRIMINO_NEXTKINDS - 2; i++){
        for (h = 0; h < TETRIMINO_HEIGHT; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
				switch(nextTetrimino[i][h][w]){
					case blockType.CONTROL_LIGHTBLUE:
						gameWindow.fillStyle = COLOR_LIGHTBLUE;
						break;
					case blockType.CONTROL_YELLOW:
						gameWindow.fillStyle = COLOR_YELLOW;
						break;
					case blockType.CONTROL_PURPLE:
						gameWindow.fillStyle = COLOR_PURPLE;
						break;
					case blockType.CONTROL_BLUE:
						gameWindow.fillStyle = COLOR_BLUE;
						break;
					case blockType.CONTROL_ORANGE:
						gameWindow.fillStyle = COLOR_ORANGE;
						break;
					case blockType.CONTROL_GREEN:
						gameWindow.fillStyle = COLOR_GREEN;
						break;
					case blockType.CONTROL_RED:
						gameWindow.fillStyle = COLOR_RED;
						break;
					default:
						gameWindow.fillStyle = COLOR_BLACK;
				}
				gameWindow.fillRect(w*blockSize + BLOCK_SIZE * FIELD_WIDTH + LEFT_FIELD_WIDTH + blockSize, h*blockSize+height + 2*blockSize, blockSize-1, blockSize-1); 
			}
		}
		height = height + (5*blockSize);
	}
}

function drawFieldHold(){
	let h,w;
	gameWindow.fillStyle="black";
	gameWindow.font="20px serif";
	gameWindow.fillText("HOLD",40,42);

	for (h = 0; h < TETRIMINO_HEIGHT; h++) {
        for (w = 0; w < TETRIMINO_WIDTH; w++) {
			gameWindow.fillStyle = COLOR_BLACK;
			gameWindow.fillRect(w*blockSize+blockSize, h*blockSize+2*blockSize, blockSize-1, blockSize-1);
			//g.fillRect(w*bs+bs, h*bs+5*bs, bs, bs);
			//g.fillStyle = COLOR_WHITE;
			//g.strokeRect(w*bs+bs, h*bs+5*bs, bs, bs);
		}
	}
	for (h = 0; h < TETRIMINO_HEIGHT; h++) {
		for (w = 0; w < TETRIMINO_WIDTH; w++) {
			switch(holdTetrimino[h][w]){
				case blockType.CONTROL_LIGHTBLUE:
					gameWindow.fillStyle = COLOR_LIGHTBLUE;
					break;
				case blockType.CONTROL_YELLOW:
					gameWindow.fillStyle = COLOR_YELLOW;
					break;
				case blockType.CONTROL_PURPLE:
					gameWindow.fillStyle = COLOR_PURPLE;
					break;
				case blockType.CONTROL_BLUE:
					gameWindow.fillStyle = COLOR_BLUE;
					break;
				case blockType.CONTROL_ORANGE:
					gameWindow.fillStyle = COLOR_ORANGE;
					break;
				case blockType.CONTROL_GREEN:
					gameWindow.fillStyle = COLOR_GREEN;
					break;
				case blockType.CONTROL_RED:
					gameWindow.fillStyle = COLOR_RED;
					break;
				default:
					gameWindow.fillStyle = COLOR_BLACK;
			}
			gameWindow.fillRect(w*blockSize+blockSize, h*blockSize+2*blockSize, blockSize-1, blockSize-1);
		}
	}
}
/*
function drawFieldHold(){
	let h,w;
	gameWindow.fillStyle="black";
	gameWindow.font="20px serif";
	gameWindow.fillText("Hold",48,42);


	gameWindow.fillStyle = COLOR_WHITE;
	gameWindow.fillRect(bs, 2*bs, bs*4, bs*4);

	gameWindow.lineWidth = 8;//千の太さを変更
	gameWindow.fillStyle = COLOR_BLACK;
	gameWindow.strokeRect(bs, 2*bs, bs*4, bs*4);

	for (h = 0; h < TETRIMINO_HEIGHT - 2; h++) {
		for (w = 0; w < TETRIMINO_WIDTH; w++) {
			switch(holdTetrimino[h][w]){
				case blockType.CONTROL_LIGHTBLUE:
					gameWindow.fillStyle = COLOR_LIGHTBLUE;
					gameWindow.fillRect(w*bs+bs, h*bs+2*bs, bs-1, bs-1);
					break;
				case blockType.CONTROL_YELLOW:
					gameWindow.fillStyle = COLOR_YELLOW;
					gameWindow.fillRect(w*bs+bs, h*bs+2*bs, bs-1, bs-1);
					break;
				case blockType.CONTROL_PURPLE:
					gameWindow.fillStyle = COLOR_PURPLE;
					gameWindow.fillRect(w*bs+bs, h*bs+2*bs, bs-1, bs-1);
					break;
				case blockType.CONTROL_BLUE:
					gameWindow.fillStyle = COLOR_BLUE;
					gameWindow.fillRect(w*bs+bs, h*bs+2*bs, bs-1, bs-1);
					break;
				case blockType.CONTROL_ORANGE:
					gameWindow.fillStyle = COLOR_ORANGE;
					gameWindow.fillRect(w*bs+bs, h*bs+2*bs, bs-1, bs-1);
					break;
				case blockType.CONTROL_GREEN:
					gameWindow.fillStyle = COLOR_GREEN;
					gameWindow.fillRect(w*bs+bs, h*bs+2*bs, bs-1, bs-1);
					break;
				case blockType.CONTROL_RED:
					gameWindow.fillStyle = COLOR_RED;
					gameWindow.fillRect(w*bs+bs, h*bs+2*bs, bs-1, bs-1);
					break;
				//default:
					//gameWindow.fillStyle = COLOR_BLACK;
			}
		}
	}
}*/

function drawScore() {
    gameWindow.fillStyle="black";
	gameWindow.font="20px serif";
	gameWindow.fillText("SCORE",37,260);
	gameWindow.fillText(('000000000'+gameScore).slice(-9),22,260+blockSize);
}

function drawHighScore(){
	gameWindow.fillStyle="black";
	gameWindow.font="20px serif";
	gameWindow.fillText("HIGHSCORE",10,188);
	gameWindow.fillText(('000000000'+scoreRanking[0]).slice(-9),22,188+blockSize);
}

function drawClearLines(){
    gameWindow.fillStyle="black";
	gameWindow.font="20px serif";
	gameWindow.fillText("LINES",43,332);
	gameWindow.fillText(('000'+clearLines).slice(-3),55,332+blockSize);
}

function drawGameLevels(){
    gameWindow.fillStyle="black";
	gameWindow.font="20px serif";
	gameWindow.fillText("LEVEL",40,404);
	gameWindow.fillText(('00'+gameLevel).slice(-2),60,404+blockSize);
}

function drawRens(){
    gameWindow.fillStyle="black";
	gameWindow.font="20px serif";
	gameWindow.fillText("COMBO",31,476);
	gameWindow.fillText(('00'+renCount).slice(-2),60,476+blockSize);

}

function drawTetris(){
	gameWindow.fillStyle="black";
	gameWindow.font="20px serif";
	gameWindow.fillText("TETRIS",35,548);
	gameWindow.fillText(('00'+tetris).slice(-2),60,548+blockSize);
}

function drawPerfectClear(){
	gameWindow.fillStyle="black";
	gameWindow.font="20px serif";
	if(hiddenCommand_changeTetrimino_Flag == 0){
		gameWindow.fillText("PERFECT",456,500);
		gameWindow.fillText(('00'+perfectClears).slice(-2),492,500+blockSize);
	}else if(hiddenCommand_changeTetrimino_Flag == 1){
		gameWindow.fillText("PERFECT",456,500+2*blockSize);
		gameWindow.fillText(('00'+perfectClears).slice(-2),492,500+3*blockSize);
	}
}

/*----------------------------------------------------------------------------------------------------*/

function drawTetrisLogo(){
	allWindow.fillStyle=COLOR_RED;
	allWindow.font="150px cursive";
	allWindow.fillText("T",11,210);
	allWindow.fillStyle=COLOR_ORANGE;
	allWindow.fillText("E",110,210);
	allWindow.fillStyle=COLOR_YELLOW;
	allWindow.fillText("T",198,210);
	allWindow.fillStyle=COLOR_GREEN;
	allWindow.fillText("R",300,210);
	allWindow.fillStyle=COLOR_LIGHTBLUE;
	allWindow.fillText("I",388,210);
	allWindow.fillStyle=COLOR_PURPLE;
	allWindow.fillText("S",458,210);
}

function drawTitleScreen(){
	clearAllWindow();
	drawTetrisLogo();

    allWindow.fillStyle="black";
	allWindow.font="20px serif";
    allWindow.fillText("1.START",245,410);
	allWindow.fillText("2.RANKING",245,435);
	allWindow.fillText("3.HELP",245,460);
}

function drawHelpScreen(){
	clearAllWindow();

	allWindow.fillStyle="black";
	allWindow.font="20px serif";

	allWindow.fillText("<ゲームのルール>",10,40);
	allWindow.fillText("縦20行横10列のフィールドに、7種類のテトリミノが上部から",10,65);
	allWindow.fillText("ランダムに落下してくる。それらを回転させたり左右に移動さ",8,90);
	allWindow.fillText("せたりして操作し、フィールドに敷き詰める。横一列揃うとそ",8,115);
	allWindow.fillText("の行が消去され点数が加算される。10ライン消去するとレベル",8,140);
	allWindow.fillText("アップし、落下速度が徐々に速くなる。NEXTには次以降出現",8,165);
	allWindow.fillText("するテトリミノが表示され、HOLDは落下中のテトリミノをキ",8,190);
	allWindow.fillText("ープし、必要なときに交換できる。プレイヤーは、できるだけ",8,215);
	allWindow.fillText("長い時間プレイを続けることを目標とする。",8,240);
	
	allWindow.fillText("<点数の加算方式>",10,290);
	allWindow.fillText("1列消去で100点、2列同時消去で400点、3列同時消去で900点、",8,315);
	allWindow.fillText("4列同時消去で1600点が加算される。それらの素点から、全消",8,340);
	allWindow.fillText("しで10倍、レベル数、連鎖数がさらに加算される。",8,365);

	allWindow.fillText("<操作方法>",8,415);
	allWindow.fillText("左移動(左矢印キー)、右移動(右矢印キー)、下移動(下矢印キー",8,440);
	allWindow.fillText(")、高速下移動(K)、右回転(上矢印キー)、左回転(L)、ホールド",8,465);
	allWindow.fillText("(H)、一時停止(W)、強制終了(Q)",8,490);

	allWindow.font="12px serif";
	allWindow.fillText("(隠しコマンドもたくさんあるよ！)",315,490);

	allWindow.font="20px serif";
	allWindow.fillText("0.戻る",260,650);
}

function drawRankingScreen(){
	let i,rankingWidth=0;
	let right = 0;
	clearAllWindow();
	allWindow.fillStyle="black";
	allWindow.font="20px serif";
	allWindow.fillText("0.戻る",260,650);

	allWindow.fillStyle="#FF8C00";
	allWindow.fillText("ランキング",238,100);

	allWindow.fillStyle = COLOR_BLACK;
	allWindow.fillText("順位                         点数",167,170);
	
	for(i=0;i<9;i++){
		allWindow.fillText(i+1+"位",170 + right,200+rankingWidth);
		rankingWidth = rankingWidth + 25;
	}
	allWindow.fillText("10位",159 + right,200+rankingWidth);

	rankingWidth = 0;
	for(i=0;i<10;i++){
		//allWindow.fillText(i+1+"位 |"+("          " + scoreRanking[i]).slice(-10),260,175+rankingWidth);
		if(scoreRanking[i] <= 999999999 && scoreRanking[i]>=100000000){
			right = 0;
		}else if(scoreRanking[i] <= 99999999 && scoreRanking[i]>=10000000){
			right = 11;
		}else if(scoreRanking[i] <= 9999999 && scoreRanking[i]>=1000000){
			right = 22;
		}else if(scoreRanking[i] <= 999999 && scoreRanking[i]>=100000){
			right = 33;
		}else if(scoreRanking[i] <= 99999 && scoreRanking[i]>=10000){
			right = 44;
		}else if(scoreRanking[i] <= 9999 && scoreRanking[i]>=1000){
			right = 55;
		}else if(scoreRanking[i] <= 999 && scoreRanking[i]>=100){
			right = 66;
		}else if(scoreRanking[i] <= 99 && scoreRanking[i]>=10){
			right = 77;
		}else if(scoreRanking[i] <= 9 && scoreRanking[i]>=0){
			right = 88;
		}
		allWindow.fillText(scoreRanking[i],300 + right,200+rankingWidth);
		
		rankingWidth = rankingWidth + 25;
	}
	//allWindow.fillText(('000000000'+gameScore).slice(-9),240,350);
}

async function drawCountDown(){

	clearAllWindow();
	drawTetrisLogo();
	
	allWindow.fillStyle="black";
	allWindow.font="80px serif";

    allWindow.fillText("3",268,400);
	await sleep(1000);
	
	clearAllWindow();
	drawTetrisLogo();
	allWindow.fillStyle="black";
	allWindow.font="80px serif";
	allWindow.fillText("2",268,400);
	await sleep(1000);

	clearAllWindow();
	drawTetrisLogo();
	allWindow.fillStyle="black";
	allWindow.font="80px serif";
	allWindow.fillText("1",268,400);
	await sleep(1000);

	clearAllWindow();
	drawTetrisLogo();
	allWindow.fillStyle="black";
	allWindow.font="50px serif";
	allWindow.fillText("START!",197,395);
	await sleep(1000);

	currentscreenState = screenState.RUNNING;

	//ここで1回表示しないと経過時間1秒でテトリミノが1つ下に設置されたところから表示されてしまう
	setTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, inControlTetrimino);
	drawField();
	if(hiddenCommand_changeTetrimino_Flag == 0){
		drawFieldNext();
	}else if(hiddenCommand_changeTetrimino_Flag == 1){
		drawFieldNextBig();
	}
	drawFieldHold();
	drawScore();
	drawHighScore();
	drawClearLines();
	drawGameLevels();
	drawRens();
	drawTetris();
	drawPerfectClear();
	
	elapsedTime();//0:00:00
	elapsedTimeCountTimer = setInterval( timePlus, 1000 );
	mainLoopTimer = setInterval( mainLoop, fallTime );

	//alert(time);
}

function drawGameOverScreen(){
	let i;
	timeWindow.clearRect(0,0,canvasTime.width,canvasTime.height);
	gameWindow.clearRect(0,0,canvasGame.width,canvasGame.height);
	clearAllWindow();
	drawTetrisLogo();
	allWindow.fillStyle=COLOR_RED;
	allWindow.font="25px serif";
	if(forcedTerminationFlag == 0){
		allWindow.fillText("GAME OVER!",208,275);
	}else if(forcedTerminationFlag == 1){
		allWindow.fillText("強制終了しました。",190,275);
	}
	
	allWindow.fillStyle=COLOR_BLACK;
	allWindow.font="20px serif";
	allWindow.fillText("今回のスコア",230,325);
	allWindow.fillText(('000000000'+gameScore).slice(-9),240,350);
	allWindow.fillText("ハイスコア",240,400);
	allWindow.fillText(('000000000'+scoreRanking[0]).slice(-9),240,425);
	if(gameScore == scoreRanking[0] && gameScore != 0){
		allWindow.fillStyle = COLOR_ORANGE;
		allWindow.fillText("ハイスコアを更新しました！",165,475);
	}
	if(gameScore != 0){
		for(i = 0; i < scoreRanking.length; i++){
			if(gameScore == scoreRanking[i]){
				allWindow.fillText(i+1+"位にランクイン！",207,525);
				break;
			}
		}
	}
	allWindow.fillStyle=COLOR_BLACK;
	allWindow.fillText("1.もう一度遊ぶ",220,600);
}

/*----------------------------------------------------------------------------------------------------*/

function mainLoop(){
	let is_fallen,right;
	
	//忘備録
	//全消しかどうか判定する関数はあるが、setしてからdrawする構造上、set→draw→全消し判定はできない
	//かといって先に全消し判定してからset→drawしても上書きされて消されてしまう
	//setの前にallClearCheckTetrimino()を実行すると全消しのカウントが加算され続けてしまう
	//引数によって加算しないようにしたが、setの前にallClearCheckTetrimino(0)とするとずっと全消し判定になってしまう
	//eraseCount >= 1としているのでバグは発生しないが、
	//関数を使うとめんどくさくなるのでflag(allClearFlag)を用いて対処する、という経緯

	//setTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, inControlTetrimino);
	if(currentscreenState == screenState.RUNNING){
		
		unsetTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, inControlTetrimino);
		is_fallen = moveInControlTetrimino(currentTetriminoPositionX, currentTetriminoPositionY + 1);
		//alert(is_fallen);
		if (!is_fallen) {//1が返された場合移動できる、0の場合できない、もしこれ以上移動できなければ
            fixTetrimino();
            eraseCompleteLine();
			holdChangeFlag = 0;
            generateTetrimino(FALL_BASE_X, FALL_BASE_Y,1);
            //次のテトリミノが配置できなければゲームオーバー
            if (isCollision(FALL_BASE_X, FALL_BASE_Y, inControlTetrimino)) {
                currentscreenState = screenState.GAMEOVER;
            }
        }

		setTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, inControlTetrimino);
		
		drawField();
		if(hiddenCommand_changeTetrimino_Flag == 0){
			drawFieldNext();
		}else if(hiddenCommand_changeTetrimino_Flag == 1){
			drawFieldNextBig();
		}
		drawFieldHold();
		drawScore();
		drawHighScore();
		drawClearLines();
		drawGameLevels();
		drawRens();
		drawTetris();
		drawPerfectClear();
		if(eraseCount >= 1){
			if(eraseCount == 4){
				gameWindow.fillStyle="black";
				gameWindow.font="50px serif";
				gameWindow.fillText("TETRIS",195,blockSize*positionPrintHeight + blockSize * 2);
			}
			//表示位置調整
			if(additionScore >= 100 && additionScore <= 999){
				right = 246;
			}else if(additionScore >= 1000 && additionScore <= 9999){
				right = 238;
			}else if(additionScore >= 10000 && additionScore <= 99999){
				right = 232;
			}else{
				right = 224;
			}
			gameWindow.font="27px serif";
			gameWindow.fillText("+" + additionScore,right,blockSize*positionPrintHeight + 70);

			eraseCount = 0;

			if(allClearFlag == 1){
				gameWindow.font="50px serif";
				gameWindow.fillText("PERFECT",170,blockSize*9);
				gameWindow.fillText("CLEAR!",195,blockSize*11);
				allClearFlag = 0;
			}
			if(renCount >= 1){
				gameWindow.font="20px serif";
				gameWindow.fillText(renCount + "combo",216,blockSize*positionPrintHeight);
			}
			if(hiddenCommand_mysteriousAddPoints_Flag == 1){
				gameWindow.font="20px serif";
				if(mysteriousAddPoints != 1){
					gameWindow.fillText("×" + mysteriousAddPoints,302,blockSize*positionPrintHeight);
				}
			}
		}
		//elapsedTime();

	}
	if (currentscreenState == screenState.GAMEOVER) {
		clearInterval(mainLoopTimer);
		clearInterval(elapsedTimeCountTimer);
		deleteFlowField();
		//deleteFlowFieldに書かないと先に実行されてしまう
        //setTimeout(drawGameOverScreen(),1100);
    }
};

function keyDownFunc(e){
	if(currentscreenState == screenState.RUNNING){
		unsetTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, inControlTetrimino);
		if(e.keyCode == 39){//右キー
			moveInControlTetrimino(currentTetriminoPositionX + 1, currentTetriminoPositionY);
		}
		else if(e.keyCode == 37){//左キー
			moveInControlTetrimino(currentTetriminoPositionX - 1, currentTetriminoPositionY);
		}
		else if(e.keyCode == 40){//下キー
			moveInControlTetrimino(currentTetriminoPositionX, currentTetriminoPositionY + 1);
		}
		else if(e.keyCode == 75){//K(高速落下移動)
			while (moveInControlTetrimino(currentTetriminoPositionX, currentTetriminoPositionY + 1)) {
				;
			}
		}
		else if(e.keyCode == 38){//上キー(右回転)
			rotateInControlTetrimino(1);
		}
		else if(e.keyCode == 76){//Lキー(左回転)
			rotateInControlTetrimino(0);
		}
		else if(e.keyCode == 72){//Hキー(ホールド)
			if(holdChangeFlag == 0){
                holdControlTetrimino();
                holdChangeFlag = 1;
            }
		}
		else if(e.keyCode == 81){//q(強制終了)
			currentscreenState = screenState.GAMEOVER;
			forcedTerminationFlag = 1;
		}
		else if(e.keyCode == 87){//q(強制終了)
			alert("一時停止中です。OKを押すと再開します。");
		}
		else if(e.keyCode == 68){//d
			if(hiddenCommand_rotateDraw_Flag == 0){
				hiddenCommand_rotateDraw_Counter++;
				if(hiddenCommand_rotateDraw_Counter == 5){
					hiddenCommand_rotateDraw_Flag = 1;
				}
			}else if(hiddenCommand_rotateDraw_Flag == 1){
				hiddenCommand_rotateDraw_Counter--;
				if(hiddenCommand_rotateDraw_Counter == 0){
					hiddenCommand_rotateDraw_Flag = 0;
				}
			}
		}
		else if(e.keyCode == 71){//g
			if(hiddenCommand_halfSecretDraw_Flag == 0){
				hiddenCommand_halfSecretDraw_Counter++;
				if(hiddenCommand_halfSecretDraw_Counter == 5){
					hiddenCommand_halfSecretDraw_Flag = 1;
				}
			}else if(hiddenCommand_halfSecretDraw_Flag == 1){
				hiddenCommand_halfSecretDraw_Counter--;
				if(hiddenCommand_halfSecretDraw_Counter == 0){
					hiddenCommand_halfSecretDraw_Flag = 0;
				}
			}
		}else if(e.keyCode == 83){//s
			hiddenCommand_gameLevelUp_Counter++;
			if(hiddenCommand_gameLevelUp_Counter % 3 == 0){
				gameLevel++;
				fallSpeedUp();
			}
		}else if(e.keyCode == 65){//a
			hiddenCommand_fieldClear_Counter++;
			if(hiddenCommand_fieldClear_Counter % 2 == 0 && hiddenCommand_fieldClear_Counter <= 6){
				fieldClear();
			}
		}
		setTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, inControlTetrimino);
		drawField();
		if(hiddenCommand_changeTetrimino_Flag == 0){
			drawFieldNext();
		}else if(hiddenCommand_changeTetrimino_Flag == 1){
			drawFieldNextBig();
		}
		drawFieldHold();
		drawScore();
		drawHighScore();
		drawClearLines();
		drawGameLevels();
		drawRens();
		drawTetris();
		drawPerfectClear();

		//elapsedTime();
	}
	if(currentscreenState == screenState.TITLE){
		if(e.keyCode == 49){
			currentscreenState = screenState.drawCountDown;
			newGame();
			drawCountDown();
		}else if(e.keyCode == 50){
			currentscreenState = screenState.RANKING;
			drawRankingScreen();
		}else if(e.keyCode == 51){
			currentscreenState = screenState.HELP;
			drawHelpScreen();
		}else if(e.keyCode == 13){
			hiddenCommand_changeTetrimino_Counter++;
			if(hiddenCommand_changeTetrimino_Counter == 10){
				hiddenCommand_changeTetrimino_Flag = 1;
				alert("特殊なテトリミノに変更！");
				changeTetrimino();
			}
		}else if(e.keyCode == 32){
			hiddenCommand_mysteriousAddPoints_Counter++;
			if(hiddenCommand_mysteriousAddPoints_Counter == 10){
				hiddenCommand_mysteriousAddPoints_Flag = 1;
				alert("謎の倍率が掛かるように変更！");
			}
		}
	}
	if(currentscreenState == screenState.RANKING || currentscreenState == screenState.HELP){
		if(e.keyCode == 48){
			currentscreenState = screenState.TITLE;
			drawTitleScreen();
		}
	}
	if(currentscreenState == screenState.GAMEOVER){
		if(e.keyCode == 49){
			currentscreenState = screenState.TITLE;
			reset();
			drawTitleScreen();
		}
	}
}

/*----------------------------------------------------------------------------------------------------*/

window.addEventListener("load", function(){
	// 初期化
	init();
	// キーボードイベント設定
	window.addEventListener("keydown", keyDownFunc, false);
	// ゲーム開始
	copy();
	drawTitleScreen();
	

});

document.getElementById("doLogin").onclick = function () {
    location.href = 'explanation.html';
}

/*
	//フィールド確認用
	for (h = 0; h < FIELD_HEIGHT; h++) {
		alert(playField[h][0]+" "+playField[h][1]+" "+playField[h][2]+" "+playField[h][3]+" "+playField[h][4]+" "+playField[h][5]+" "+
			playField[h][6]+" "+playField[h][7]+" "+playField[h][8]+" "+playField[h][9]+" "+playField[h][10]+" "+playField[h][11]);
    }

*/