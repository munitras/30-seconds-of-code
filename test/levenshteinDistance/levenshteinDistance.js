const levenshteinDistance  = (string1, string2) => {
if(string1.length === 0) return string2.length;
if(string2.length === 0) return string1.length;
let matrix = Array(string2.length + 1).fill(0).map((x,i) => [i]);
matrix[0] = Array(string1.length + 1).fill(0).map((x,i) => i);
for(let i = 1; i <= string2.length; i++){
for(let j = 1; j<=string1.length; j++){
if(string2[i-1] === string1[j-1]){
matrix[i][j] = matrix[i-1][j-1];
}
else{
matrix[i][j] = Math.min(matrix[i-1][j-1]+1, matrix[i][j-1]+1, matrix[i-1][j]+1);
}
}
}
return matrix[string2.length][string1.length];
};
module.exports = levenshteinDistance;