var {canvas, ctx, pen, geo, mouse, state, Piece, run} = initializeDocument('Annulus Chess');

geo.excludedSquares = [];

geo.rookLines = [
  [0,1,2,3],[4,5,6,7],
  [8,9,10,11],[12,13,14,15],
  [16,17,18,19],[20,21,22,23],
  [24,25,26,27],[28,29,30,31],
  [32,33,34,35],[36,37,38,39],
  [40,41,42,43],[44,45,46,47],
  [48,49,50,51],[52,53,54,55],
  [56,57,58,59],[60,61,62,63],
  [0,8,16,24,32,40,48,56,63,55,47,39,31,23,15,7,0],
  [1,9,17,25,33,41,49,57,62,54,46,38,30,22,14,6,1],
  [2,10,18,26,34,42,50,58,61,53,45,37,29,21,13,5,2],
  [3,11,19,27,35,43,51,59,60,52,44,36,28,20,12,4,3],
];

geo.bishopLines = [
  [0,9,18,27],[0,6,13,20],
  [8,17,26,35],[8,1,5,12],
  [16,25,34,43],[16,9,2,4],
  [24,33,42,51],[24,17,10,3],
  [32,41,50,59],[32,25,18,11],
  [40,49,58,60],[40,33,26,19],
  [48,57,61,52],[48,41,34,27],
  [56,62,53,44],[56,49,42,35],
  [63,54,45,36],[63,57,50,43],
  [55,46,37,28],[55,62,58,51],
  [47,38,29,20],[47,54,61,59],
  [39,30,21,12],[39,46,53,60],
  [31,22,13,4],[31,38,45,52],
  [23,14,5,3],[23,30,37,44],
  [15,6,2,11],[15,22,29,36],
  [7,1,10,19],[7,14,21,28],
];

geo.knightOffsets = [
[17,10,5,15],[18,11,4,13,15,16],[19,12,14,7,8,17],[13,6,9,18],[21,14,1,10],[22,15,0,9,11,20],[23,8,10,3,12,21],[9,2,13,22],
[25,18,2,6],[24,26,19,3,5,7],[16,25,27,4,6,0],[13,6,9,26],[29,22,6,2],[28,30,23,7,1,3],[20,29,31,0,2,4],[1,5,21,31],
[33,26,10,1],[32,34,27,11,2,0],[24,33,35,3,1,8],[2,9,25,34],[37,30,14,5],[36,38,31,15,6,4],[28,37,39,7,5,12],[6,13,29,38],
[41,34,18,9],[40,42,35,19,10,8],[32,41,43,11,9,16],[10,17,33,42],[45,38,22,13],[44,46,39,23,14,12],[36,45,47,15,13,20],[14,21,37,46],
[49,42,26,17],[48,50,43,27,18,16],[40,49,51,19,17,24],[18,25,41,50],[53,46,30,21],[52,54,47,31,22,20],[44,53,55,23,21,28],[22,29,45,54],
[57,50,34,25],[56,58,51,35,26,24],[48,57,59,27,25,32,],[26,33,49,58],[61,54,38,29],[60,62,55,39,30,28],[52,61,63,31,29,36],[30,37,53,62],
[62,58,42,33],[63,61,59,43,34,32],[56,62,60,35,33,40],[34,41,57,61],[58,62,46,37],[59,57,63,47,38,36],[39,37,44,60,58,56],[38,45,61,57],
[41,50,61,54],[55,53,60,51,42,40],[63,54,52,43,41,48],[42,49,62,53],[50,57,54,45],[51,49,56,55,46,44],[59,50,48,47,45,52],[46,53,58,49],
];

geo.kingOffsets = [
[8,9,1,6,7],[9,10,2,5,6,7,0,8],[10,11,3,4,5,6,1,9],[4,5,2,10,11],[3,12,13,5,2],[2,3,4,12,13,14,6,1],[1,2,5,13,14,15,7,0],[0,1,6,14,15],
[16,17,9,1,0],[17,18,10,2,1,0,8,16],[18,19,11,3,2,1,9,17],[19,3,2,10,18],[4,20,21,13,5],[5,4,12,20,21,22,14,6],[6,5,13,21,22,23,15,7],[7,6,14,22,23],
[24,25,17,9,8],[25,26,18,10,9,8,16,24],[26,27,19,11,10,9,17,25],[27,11,10,18,26],[12,28,29,21,13],[13,12,20,28,29,30,22,14],[14,13,21,29,30,31,23,15],[15,14,22,30,31],
[32,33,25,17,16],[33,34,26,18,17,16,24,32],[34,35,27,19,18,17,25,33],[35,19,18,26,34],[20,36,37,29,21],[21,20,28,36,37,38,30,22],[22,21,29,37,38,39,31,23],[23,22,30,38,39],
[40,41,33,25,24],[41,42,34,26,25,24,32,40],[42,43,35,27,26,25,33,41],[43,27,26,34,42],[28,44,45,37,29],[29,28,36,44,45,46,38,30],[30,29,37,45,46,47,39,31],[31,30,38,46,47],
[48,49,41,33,32],[49,50,42,34,33,32,40,48],[50,51,43,35,34,33,41,49],[51,35,34,42,50],[36,52,53,45,37],[37,36,44,52,53,54,46,38],[38,37,45,53,54,55,47,39],[39,38,46,54,55],
[56,57,49,41,40],[57,58,50,42,41,40,48,56],[58,59,51,43,42,41,49,57],[59,43,42,50,58],[44,60,61,53,45],[45,44,52,60,61,62,54,46],[46,45,53,61,62,63,55,47],[47,46,54,62,63],
[63,62,57,49,48],[62,61,58,50,49,48,56,63],[61,60,59,51,50,49,57,62],[60,51,50,58,61],[52,59,58,61,53],[53,52,60,59,58,57,62,54],[54,53,61,58,57,56,63,55],[55,54,62,57,56],
];

geo.whitePawnLines = [[0,8,16,24,32,40,48,56],[1,9,17,25,33,41,49,57],[2,10,18,26,34,42,50,58],[3,11,19,27,35,43,51,59],[4,12,20,28,36,44,52,60],[5,13,21,29,37,45,53,61],[6,14,22,30,38,46,54,62],[7,15,23,31,39,47,55,63]];

geo.blackPawnLines = [[56,48,40,32,24,16,8,0],[57,49,41,33,25,17,9,1],[58,50,42,34,26,18,10,2],[59,51,43,35,27,19,11,3],[60,52,44,36,28,20,12,4],[61,53,45,37,29,21,13,5],[62,54,46,38,30,22,14,6],[63,55,47,39,31,23,15,7]];
//////////
geo.whitePawnCaptures = [
[9],[8,10],[9,11],[10],[13],[12,14],[13,15],[14],
[17],[16,18],[17,19],[18],[21],[20,22],[21,23],[22],
[25],[24,26],[25,27],[26],[29],[28,30],[29,31],[30],
[33],[32,34],[33,35],[34],[37],[36,38],[37,39],[38],
[41],[40,42],[41,43],[42],[45],[44,46],[45,47],[46],
[49],[48,50],[49,51],[50],[53],[52,54],[53,55],[54],
[57],[56,58],[57,59],[58],[61],[60,62],[61,63],[62],
[],[],[],[],[],[],[],[],
];

geo.blackPawnCaptures = [
[],[],[],[],[],[],[],[],
[1],[0,2],[1,3],[2],[5],[4,6],[5,7],[6],
[9],[8,10],[9,11],[10],[13],[12,14],[13,15],[14],
[17],[16,18],[17,19],[18],[21],[20,22],[21,23],[22],
[25],[24,26],[25,27],[26],[29],[28,30],[29,31],[30],
[33],[32,34],[33,35],[34],[37],[36,38],[37,39],[38],
[41],[40,42],[41,43],[42],[45],[44,46],[45,47],[46],
[49],[48,50],[49,51],[50],[53],[52,54],[53,55],[54],
];

geo.whitePromoSquares = [56,57,58,59,60,61,62,63];
geo.blackPromoSquares = [0,1,2,3,4,5,6];

var backRanks = [geo.whitePromoSquares,geo.blackPromoSquares];

geo.castleData = [
  [4, 7, 6, 5, 'white'],
  [4, 0, 1, 2, 'white'],
  [60, 63, 62, 61, 'black'],
  [60, 56, 57, 58, 'black'],
];

geo.findLineWith = function(sq1,sq2) {
  for (var line of backRanks)
    if (line.includes(sq1) && line.includes(sq2)) return line;
  return null;
}

var ns = .07;
var ms = .08;

geo.getScale = (x,y) => {
  var r = Math.hypot(x-.5,y-.5);
  return (ms-ns)/.2*(r-.2)+ns;
}

geo.getOrientation = (x,y,color) => {
  if (color === 'black') return Math.atan2(y-.5,x-.5) + pi/2;
  return Math.atan2(y-.5,x-.5) - pi/2;
}

var R0 = 15/49/2;
var R1 = 16/49/2;
var R2 = 24/49/2;
var R3 = 32/49/2;
var R4 = 40/49/2;
var R5 = 48/49/2;
var R6 = 49/49/2;

var pi = Math.PI;

var phi0 = 0;
var phi1 = 15*pi/8;
var phi2 = 7*pi/4;
var phi3 = 13*pi/8;
var phi4 = 3*pi/2;
var phi5 = 11*pi/8;
var phi6 = 5*pi/4;
var phi7 = 9*pi/8;
var phi8 = pi;
var phi9 = 7*pi/8;
var phi10 = 3*pi/4;
var phi11 = 5*pi/8;
var phi12 = pi/2;
var phi13 = 3*pi/8;
var phi14 = pi/4;
var phi15 = pi/8;

var a0 = [.5+R1*Math.cos(phi0),.5+R1*Math.sin(phi0)];
var a1 = [.5+R1*Math.cos(phi1),.5+R1*Math.sin(phi1)];
var a2 = [.5+R1*Math.cos(phi2),.5+R1*Math.sin(phi2)];
var a3 = [.5+R1*Math.cos(phi3),.5+R1*Math.sin(phi3)];
var a4 = [.5+R1*Math.cos(phi4),.5+R1*Math.sin(phi4)];
var a5 = [.5+R1*Math.cos(phi5),.5+R1*Math.sin(phi5)];
var a6 = [.5+R1*Math.cos(phi6),.5+R1*Math.sin(phi6)];
var a7 = [.5+R1*Math.cos(phi7),.5+R1*Math.sin(phi7)];
var a8 = [.5+R1*Math.cos(phi8),.5+R1*Math.sin(phi8)];
var a9 = [.5+R1*Math.cos(phi9),.5+R1*Math.sin(phi9)];
var a10 = [.5+R1*Math.cos(phi10),.5+R1*Math.sin(phi10)];
var a11 = [.5+R1*Math.cos(phi11),.5+R1*Math.sin(phi11)];
var a12 = [.5+R1*Math.cos(phi12),.5+R1*Math.sin(phi12)];
var a13 = [.5+R1*Math.cos(phi13),.5+R1*Math.sin(phi13)];
var a14 = [.5+R1*Math.cos(phi14),.5+R1*Math.sin(phi14)];
var a15 = [.5+R1*Math.cos(phi15),.5+R1*Math.sin(phi15)];

var b0 = [.5+R2*Math.cos(phi0),.5+R2*Math.sin(phi0)];
var b1 = [.5+R2*Math.cos(phi1),.5+R2*Math.sin(phi1)];
var b2 = [.5+R2*Math.cos(phi2),.5+R2*Math.sin(phi2)];
var b3 = [.5+R2*Math.cos(phi3),.5+R2*Math.sin(phi3)];
var b4 = [.5+R2*Math.cos(phi4),.5+R2*Math.sin(phi4)];
var b5 = [.5+R2*Math.cos(phi5),.5+R2*Math.sin(phi5)];
var b6 = [.5+R2*Math.cos(phi6),.5+R2*Math.sin(phi6)];
var b7 = [.5+R2*Math.cos(phi7),.5+R2*Math.sin(phi7)];
var b8 = [.5+R2*Math.cos(phi8),.5+R2*Math.sin(phi8)];
var b9 = [.5+R2*Math.cos(phi9),.5+R2*Math.sin(phi9)];
var b10 = [.5+R2*Math.cos(phi10),.5+R2*Math.sin(phi10)];
var b11 = [.5+R2*Math.cos(phi11),.5+R2*Math.sin(phi11)];
var b12 = [.5+R2*Math.cos(phi12),.5+R2*Math.sin(phi12)];
var b13 = [.5+R2*Math.cos(phi13),.5+R2*Math.sin(phi13)];
var b14 = [.5+R2*Math.cos(phi14),.5+R2*Math.sin(phi14)];
var b15 = [.5+R2*Math.cos(phi15),.5+R2*Math.sin(phi15)];

var c0 = [.5+R3*Math.cos(phi0),.5+R3*Math.sin(phi0)];
var c1 = [.5+R3*Math.cos(phi1),.5+R3*Math.sin(phi1)];
var c2 = [.5+R3*Math.cos(phi2),.5+R3*Math.sin(phi2)];
var c3 = [.5+R3*Math.cos(phi3),.5+R3*Math.sin(phi3)];
var c4 = [.5+R3*Math.cos(phi4),.5+R3*Math.sin(phi4)];
var c5 = [.5+R3*Math.cos(phi5),.5+R3*Math.sin(phi5)];
var c6 = [.5+R3*Math.cos(phi6),.5+R3*Math.sin(phi6)];
var c7 = [.5+R3*Math.cos(phi7),.5+R3*Math.sin(phi7)];
var c8 = [.5+R3*Math.cos(phi8),.5+R3*Math.sin(phi8)];
var c9 = [.5+R3*Math.cos(phi9),.5+R3*Math.sin(phi9)];
var c10 = [.5+R3*Math.cos(phi10),.5+R3*Math.sin(phi10)];
var c11 = [.5+R3*Math.cos(phi11),.5+R3*Math.sin(phi11)];
var c12 = [.5+R3*Math.cos(phi12),.5+R3*Math.sin(phi12)];
var c13 = [.5+R3*Math.cos(phi13),.5+R3*Math.sin(phi13)];
var c14 = [.5+R3*Math.cos(phi14),.5+R3*Math.sin(phi14)];
var c15 = [.5+R3*Math.cos(phi15),.5+R3*Math.sin(phi15)];

var d0 = [.5+R4*Math.cos(phi0),.5+R4*Math.sin(phi0)];
var d1 = [.5+R4*Math.cos(phi1),.5+R4*Math.sin(phi1)];
var d2 = [.5+R4*Math.cos(phi2),.5+R4*Math.sin(phi2)];
var d3 = [.5+R4*Math.cos(phi3),.5+R4*Math.sin(phi3)];
var d4 = [.5+R4*Math.cos(phi4),.5+R4*Math.sin(phi4)];
var d5 = [.5+R4*Math.cos(phi5),.5+R4*Math.sin(phi5)];
var d6 = [.5+R4*Math.cos(phi6),.5+R4*Math.sin(phi6)];
var d7 = [.5+R4*Math.cos(phi7),.5+R4*Math.sin(phi7)];
var d8 = [.5+R4*Math.cos(phi8),.5+R4*Math.sin(phi8)];
var d9 = [.5+R4*Math.cos(phi9),.5+R4*Math.sin(phi9)];
var d10 = [.5+R4*Math.cos(phi10),.5+R4*Math.sin(phi10)];
var d11 = [.5+R4*Math.cos(phi11),.5+R4*Math.sin(phi11)];
var d12 = [.5+R4*Math.cos(phi12),.5+R4*Math.sin(phi12)];
var d13 = [.5+R4*Math.cos(phi13),.5+R4*Math.sin(phi13)];
var d14 = [.5+R4*Math.cos(phi14),.5+R4*Math.sin(phi14)];
var d15 = [.5+R4*Math.cos(phi15),.5+R4*Math.sin(phi15)];

var e0 = [.5+R5*Math.cos(phi0),.5+R5*Math.sin(phi0)];
var e1 = [.5+R5*Math.cos(phi1),.5+R5*Math.sin(phi1)];
var e2 = [.5+R5*Math.cos(phi2),.5+R5*Math.sin(phi2)];
var e3 = [.5+R5*Math.cos(phi3),.5+R5*Math.sin(phi3)];
var e4 = [.5+R5*Math.cos(phi4),.5+R5*Math.sin(phi4)];
var e5 = [.5+R5*Math.cos(phi5),.5+R5*Math.sin(phi5)];
var e6 = [.5+R5*Math.cos(phi6),.5+R5*Math.sin(phi6)];
var e7 = [.5+R5*Math.cos(phi7),.5+R5*Math.sin(phi7)];
var e8 = [.5+R5*Math.cos(phi8),.5+R5*Math.sin(phi8)];
var e9 = [.5+R5*Math.cos(phi9),.5+R5*Math.sin(phi9)];
var e10 = [.5+R5*Math.cos(phi10),.5+R5*Math.sin(phi10)];
var e11 = [.5+R5*Math.cos(phi11),.5+R5*Math.sin(phi11)];
var e12 = [.5+R5*Math.cos(phi12),.5+R5*Math.sin(phi12)];
var e13 = [.5+R5*Math.cos(phi13),.5+R5*Math.sin(phi13)];
var e14 = [.5+R5*Math.cos(phi14),.5+R5*Math.sin(phi14)];
var e15 = [.5+R5*Math.cos(phi15),.5+R5*Math.sin(phi15)];

var a = [a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15];
var e = [e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,e10,e11,e12,e13,e14,e15];

var corners = [
//[p0 ,p1 ,p2 ,p3 ,r0,r1,phi0 ,phi1 ],
  [e12,e11,d11,d12,R4,R5,phi12,phi11],
  [d12,d11,c11,c12,R3,R4,phi12,phi11],
  [c12,c11,b11,b12,R2,R3,phi12,phi11],
  [b12,b11,a11,a12,R1,R2,phi12,phi11],
  [b13,b12,a12,a13,R1,R2,phi13,phi12],
  [c13,c12,b12,b13,R2,R3,phi13,phi12],
  [d13,d12,c12,c13,R3,R4,phi13,phi12],
  [e13,e12,d12,d13,R4,R5,phi13,phi12],

  [e11,e10,d10,d11,R4,R5,phi11,phi10],
  [d11,d10,c10,c11,R3,R4,phi11,phi10],
  [c11,c10,b10,b11,R2,R3,phi11,phi10],
  [b11,b10,a10,a11,R1,R2,phi11,phi10],
  [b14,b13,a13,a14,R1,R2,phi14,phi13],
  [c14,c13,b13,b14,R2,R3,phi14,phi13],
  [d14,d13,c13,c14,R3,R4,phi14,phi13],
  [e14,e13,d13,d14,R4,R5,phi14,phi13],

  [e10,e9,d9,d10,R4,R5,phi10,phi9],
  [d10,d9,c9,c10,R3,R4,phi10,phi9],
  [c10,c9,b9,b10,R2,R3,phi10,phi9],
  [b10,b9,a9,a10,R1,R2,phi10,phi9],
  [b15,b14,a14,a15,R1,R2,phi15,phi14],
  [c15,c14,b14,b15,R2,R3,phi15,phi14],
  [d15,d14,c14,c15,R3,R4,phi15,phi14],
  [e15,e14,d14,d15,R4,R5,phi15,phi14],

  [e9,e8,d8,d9,R4,R5,phi9,phi8],
  [d9,d8,c8,c9,R3,R4,phi9,phi8],
  [c9,c8,b8,b9,R2,R3,phi9,phi8],
  [b9,b8,a8,a9,R1,R2,phi9,phi8],
  [b0,b15,a15,a0,R1,R2,phi0,phi15],
  [c0,c15,b15,b0,R2,R3,phi0,phi15],
  [d0,d15,c15,c0,R3,R4,phi0,phi15],
  [e0,e15,d15,d0,R4,R5,phi0,phi15],

  [e8,e7,d7,d8,R4,R5,phi8,phi7],
  [d8,d7,c7,c8,R3,R4,phi8,phi7],
  [c8,c7,b7,b8,R2,R3,phi8,phi7],
  [b8,b7,a7,a8,R1,R2,phi8,phi7],
  [b1,b0,a0,a1,R1,R2,phi1,phi0],
  [c1,c0,b0,b1,R2,R3,phi1,phi0],
  [d1,d0,c0,c1,R3,R4,phi1,phi0],
  [e1,e0,d0,d1,R4,R5,phi1,phi0],

  [e7,e6,d6,d7,R4,R5,phi7,phi6],
  [d7,d6,c6,c7,R3,R4,phi7,phi6],
  [c7,c6,b6,b7,R2,R3,phi7,phi6],
  [b7,b6,a6,a7,R1,R2,phi7,phi6],
  [b2,b1,a1,a2,R1,R2,phi2,phi1],
  [c2,c1,b1,b2,R2,R3,phi2,phi1],
  [d2,d1,c1,c2,R3,R4,phi2,phi1],
  [e2,e1,d1,d2,R4,R5,phi2,phi1],

  [e6,e5,d5,d6,R4,R5,phi6,phi5],
  [d6,d5,c5,c6,R3,R4,phi6,phi5],
  [c6,c5,b5,b6,R2,R3,phi6,phi5],
  [b6,b5,a5,a6,R1,R2,phi6,phi5],
  [b3,b2,a2,a3,R1,R2,phi3,phi2],
  [c3,c2,b2,b3,R2,R3,phi3,phi2],
  [d3,d2,c2,c3,R3,R4,phi3,phi2],
  [e3,e2,d2,d3,R4,R5,phi3,phi2],

  [e5,e4,d4,d5,R4,R5,phi5,phi4],
  [d5,d4,c4,c5,R3,R4,phi5,phi4],
  [c5,c4,b4,b5,R2,R3,phi5,phi4],
  [b5,b4,a4,a5,R1,R2,phi5,phi4],
  [b4,b3,a3,a4,R1,R2,phi4,phi3],
  [c4,c3,b3,b4,R2,R3,phi4,phi3],
  [d4,d3,c3,c4,R3,R4,phi4,phi3],
  [e4,e3,d3,d4,R4,R5,phi4,phi3],
];

geo.centers = [];

var O = [0.5,0.5];

var drawCell = corners.map(p => {
  var [p0,p1,p2,p3,r0,r1,phi0,phi1] = p;
  var rc = (r0 + r1)/2;
  var m = [(p0[0] + p1[0] - 1)/2,(p0[1] + p1[1] - 1)/2];
  var phic = Math.atan2(m[1],m[0]);
  var center = [.5+rc*Math.cos(phic),.5+rc*Math.sin(phic)];
  geo.centers.push(center);
  return function() {
    pen.moveTo(p0);
    pen.arc(O,r1,phi0,phi1);
    pen.lineTo(p2);
    pen.arc(O,r0,phi1,phi0,true);
    pen.lineTo(p0);
  }
});

function drawBoard(dark='#B88762',light='#EED7B0') {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  var s = canvas.width;
  ctx.fillStyle = dark;
  pen.moveTo(e0);
  ctx.beginPath();
  pen.arc(O,R5,0,2*Math.PI);
  pen.arc(O,R1,0,2*Math.PI,true);
  ctx.fill();
  ctx.closePath();
  ctx.fillStyle = light;
  ctx.beginPath();
  for (var i = 0; i < 64; i++) {
    var x = i & 7;
    var y = i >> 3;
    var p = (x + y) % 2;
    if (!p) continue;
    drawCell[i]();
  }
  ctx.fill();
  ctx.closePath();
}

function drawGridlines(color='black',lineWidth=1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  pen.moveTo(e0);
  pen.arc(O,R5,0,2*Math.PI);
  pen.moveTo(d0);
  pen.arc(O,R4,0,2*Math.PI);
  pen.moveTo(c0);
  pen.arc(O,R3,0,2*Math.PI);
  pen.moveTo(b0);
  pen.arc(O,R2,0,2*Math.PI);
  pen.moveTo(a0);
  pen.arc(O,R1,0,2*Math.PI);
  for (var i = 0; i < 16; i++) {
    pen.moveTo(a[i]);
    pen.lineTo(e[i]);
  }
  ctx.stroke();
  ctx.closePath();
}

pen.drawBoard = drawBoard;
pen.drawGridlines = drawGridlines;

var tau = 2*Math.PI;

mouse.getId = function(x,y) {
  mouse.id = -1;
  x -= .5;
  y -= .5;
  var r = Math.hypot(x,y);
  if (r < R1) return;
  if (r > R5) return;
  var phi = -Math.atan2(y,x);
  phi = ((phi % tau) + tau) % tau;
  phi /= pi/8;
  phi = Math.floor(phi);
  if (r > R4) mouse.id = [39,47,55,63,56,48,40,32,24,16,8,0,7,15,23,31][phi];
  else if (r > R3) mouse.id = [38,46,54,62,57,49,41,33,25,17,9,1,6,14,22,30][phi];
  else if (r > R2) mouse.id = [37,45,53,61,58,50,42,34,26,18,10,2,5,13,21,29][phi];
  else mouse.id = [36,44,52,60,59,51,43,35,27,19,11,3,4,12,20,28][phi];
}

state.newGame = function() {
  Piece.clear();
  Piece.create('white','rook',0);
  Piece.create('white','knight',1);
  Piece.create('white','bishop',2);
  Piece.create('white','queen',3);
  Piece.create('white','king',4);
  Piece.create('white','bishop',5);
  Piece.create('white','knight',6);
  Piece.create('white','rook',7);
  Piece.create('white','pawn',8);
  Piece.create('white','pawn',9);
  Piece.create('white','pawn',10);
  Piece.create('white','pawn',11);
  Piece.create('white','pawn',12);
  Piece.create('white','pawn',13);
  Piece.create('white','pawn',14);
  Piece.create('white','pawn',15);
  Piece.create('black','pawn',48);
  Piece.create('black','pawn',49);
  Piece.create('black','pawn',50);
  Piece.create('black','pawn',51);
  Piece.create('black','pawn',52);
  Piece.create('black','pawn',53);
  Piece.create('black','pawn',54);
  Piece.create('black','pawn',55);
  Piece.create('black','rook',56);
  Piece.create('black','knight',57);
  Piece.create('black','bishop',58);
  Piece.create('black','queen',59);
  Piece.create('black','king',60);
  Piece.create('black','bishop',61);
  Piece.create('black','knight',62);
  Piece.create('black','rook',63);
}

state.newGame();



function hl() {
  for (var move of state.moves) {
    var id = move.to;
    var m = centers[id];
    if (!m) continue;
    var piece = Piece.at(id);
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.globalAlpha = .25;
    pen.moveTo(m);
    if (piece) {
      pen.arc(m,.05*1,0,2*Math.PI);
      pen.arc(m,.05*.8,0,2*Math.PI,true);
    } else {
      pen.arc(m,.05*.4,0,2*Math.PI);
    }
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.closePath();
  }
}

run()