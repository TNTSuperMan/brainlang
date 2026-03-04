- Add +++
- Set [-]+++
- Move [->+<]
- Mul [->++<]
- LoopStart [
- LoopEnd ]
- LoopEndWithOffset >>]
- Shift(FindZero) [>>]
- IO .,


## memory
reg0
reg1
reg2
reg3
Zero
?
reg4
reg5
reg6
reg7
DynamicMark1
DynamicTmp1
D1-1
D1-2
D1-3
D1-4
DynamicMark2
DynamicTmp2
D2-1
D2-2
D2-3
D2-4

## IR1
- static[1] < 

## IR0
- [1] = 0 `>[-]+<`
- [1] += 1 / [1] -= 255 `>+<`
- [4] <= [1] `>[->>>+<<<]<`
- shift 4 `>>>>`
- [2] { nnn } `>>[nnn]<<`
- 
