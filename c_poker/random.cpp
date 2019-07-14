#include <iostream>
#include <stdlib.h>
#include <math.h>
#include <ctime>
#include <algorithm>
#include <queue>
using namespace std;

#define ALL_CARD_NUM 52

// [S]pade [H]eart [D]ia [C]lub
// 13으로 나눈 몫    -> 각각 0 / 1 / 2 / 3 (0~12 / 13~25 / 26~38 / 39~51)
// 13으로 나눈 나머지 -> 2~10(0~8), J(9), Q(10), K(11), A(12)

int player_num, N, M, count;
bool input_card[52];
queue<int> output;
int shared_card[5];
bool check_card[52];
int player_game_num[12];
int player_win[12];
bool player_range[12][13][13];

int all = 0;

void clear_queue(queue<int> &q){
    queue<int> empty;
    swap(q, empty);
}

void init_game(){
    srand((unsigned int)time(0));
    clear_queue(output);
    memset(input_card, true, sizeof(input_card));
    memset(shared_card, 0, sizeof(shared_card));
    memset(player_win, 0, sizeof(player_win));
}

void input_dead_cards(){
    printf("Input Player number / M(shared card number)\n");
    scanf("%d%d", &player_num, &M);
    printf("Input M shared cards..\n");
    for(int i = 0; i < M; i++){
        int x; scanf("%d", &x);
        shared_card[i] = x;
        input_card[x] = false; // shared card not counted in hand combo
    }
    for(int i = 1; i <= player_num; i++){
        int player_range_number;
        printf("Input player %d range number..\n", i);
        scanf("%d", &player_range_number);
        if(player_range_number == 0){ // 0 == 전부 선택 (for test 편의)
            for(int j = 0; j < 13; j++){
                for(int k = 0; k < 13; k++){
                    player_range[i-1][j][k] = true;
                }
            }
        }
        else{
            int cnt = 0;
            printf("Input player %d's range..\n", i);
            for(int j = 0; j < player_range_number; j++){
                int x, y; scanf("%d%d", &x, &y);
                player_range[i-1][x][y] = true;
                // x == y : pair(4) / x > y : 문양이 같음(4) / x < y : 문양이 다름(12)
            }
        }
    }
}

// 공유 카드 5 - M 장 저장(random 한 정수)
void Monte_Carlo(){
    int num = 5 - M + 2 * player_num;
    for(int i = 0; i < num; i++){
        int now = rand() % 52;

        if(input_card[now] == false || check_card[now] == true){
            i--; continue;
        }
        check_card[now] = true;
        output.push(now);
    }
}

bool check_card_in_player_range(int player, int card_1, int card_2){ // (card_1, card_2) 가 player 의 range 에 포함되는지 확인하는 함수
    int pattern1 = card_1 / 13, num1 = card_1 % 13;
    int pattern2 = card_2 / 13, num2 = card_2 % 13;
    
    if(num1 == num2) return player_range[player][num1][num2];
    else{
        if(num1 < num2){
            swap(pattern1, pattern2);
            swap(num1, num2);
        }
        if(pattern1 == pattern2) return player_range[player][num1][num2];
        else return player_range[player][num2][num1];
    }
}

bool check_straight(int * num){
    int diff1 = num[1] - num[0];
    int diff2 = num[2] - num[1];
    int diff3 = num[3] - num[2];
    int diff4 = num[4] - num[3];

    if(diff1 == diff2 == diff3 == diff4 == 1) return true; // 일반적인 경우
    // 2(0) 3(1) 4(2) 5(3) A(12)
    if(num[0] == 0 && num[1] == 1 && num[2] == 2 && num[3] == 3 && num[4] == 12) return true;
    // 2(0) 3(1) 4(2) K(11) A(12)
    if(num[0] == 0 && num[1] == 1 && num[2] == 2 && num[3] == 11 && num[4] == 12) return true;
    // 2(0) 3(1) Q(10) K(11) A(12)
    if(num[0] == 0 && num[1] == 1 && num[2] == 10 && num[3] == 11 && num[4] == 12) return true;
    // 2(0) J(9) Q(10) K(11) A(12)
    if(num[0] == 0 && num[1] == 9 && num[2] == 10 && num[3] == 11 && num[4] == 12) return true;

    return false;
}

int thirteen_multi(int n){ // 13^n 반환
    int x = 1;
    while(n--){
        x *= 13;
    }
    return x;
}

// 5장으로 만들 수 있는 조합 만드는 함수
// 패 강함에 따라 숫자 부여, 대소관계로 패 비교
// 스트레이트 플러시 > 포카드 > 풀하우스 > 플러시 > 스트레이트 > 트리플 > 투 페어 > 원 페어 > 탑
int made(int * hand){
    int result = 0;
    int num[5], pattern[5];
    for(int i = 0; i < 5; i++) pattern[i] = hand[i] / 13;
    for(int i = 0; i < 5; i++){
        num[i] = hand[i] % 13;
        num[i]++; // zero -> one for caculating normally
    }
    sort(num, num+5); sort(pattern, pattern+5);
    int mul1 = thirteen_multi(1); // 13^1
    int mul2 = thirteen_multi(2); // 13^2
    int mul3 = thirteen_multi(3); // 13^3
    int mul4 = thirteen_multi(4); // 13^4
    int mul5 = thirteen_multi(5); // 13^5

    if(pattern[0] == pattern[1] == pattern[2] == pattern[3] == pattern[4]){
        // 스트레이트 플러시
        if(check_straight(num)){
            result  = 100000000;
            result += num[4];
        }
        // 플러시
        else{
            result  = 100000;
            result += num[4]*mul4 + num[3]*mul3 + num[2]*mul2 + num[1]*mul1 + num[0];
        }
    }
    else{ // 플러시 제외
        // 포카드
        if(num[0] == num[1] == num[2] == num[3] || num[0] == num[1] == num[2] == num[4] || num[0] == num[1] == num[3] == num[4] || num[0] == num[2] == num[3] == num[4] || num[1] == num[2] == num[3] == num[4]){
            result  = 10000000;
            if(num[0] == num[1] == num[2] == num[3]) result += num[3] * 10000 + num[4];
            else if(num[0] == num[1] == num[2] == num[4]) result += num[4] * 10000 + num[3];
            else if(num[0] == num[1] == num[3] == num[4]) result += num[4] * 10000 + num[2];
            else if(num[0] == num[2] == num[3] == num[4]) result += num[4] * 10000 + num[1];
            else result += num[4] * 10000 + num[0];
            
        }
        // 풀하우스
        else if(num[0] == num[2] && num[3] == num[4] || num[2] == num[4] && num[0] == num[1]){
            result  = 1000000;
            if(num[0] == num[2]) result += num[0] * 100 + num[4];
            else result += num[0] + num[4] * 100;
        }
        // 스트레이트
        else if(check_straight(num)){
            result  = 10000;
            result += num[4];
        }
        // 트리플
        else if(num[0] == num[2] || num[1] == num[3] || num[2] == num[4]){
            result  = 1000;
            result += num[2] * mul2; // 3개가 같으면 반드시 num[2] 에 속함
            if(num[0] == num[2]) result += num[4] * mul1 + num[3];
            else if(num[1] == num[3]) result += num[4] * mul1 + num[0];
            else result += num[1] * mul1 + num[0];
        }
        // 투 페어 -> 음수에서 따짐
        else if(num[0] == num[1] && num[2] == num[3] || num[0] == num[1] && num[3] == num[4] || num[1] == num[2] && num[3] == num[4]){
            result  = -10000;
            if(num[0] == num[1] && num[2] == num[3]) result += num[3] * mul2 + num[1] * mul2 + num[4];
            else if(num[0] == num[1] && num[3] == num[4]) result += num[4] * mul2 + num[1] * mul2 + num[2];   
            else result += num[4] * mul2 + num[2] * mul2 + num[0];
        }
        // 원 페어 -> 음수에서 따짐
        else if(num[0] == num[1] || num[1] == num[2] || num[2] == num[3] || num[3] == num[4]){
            result  = -100000;
            if(num[0] == num[1]) result += num[1] * mul3 + num[4] * mul2 + num[3] * mul1 + num[2];
            else if(num[1] == num[2]) result += num[2] * mul3 + num[4] * mul2 + num[3] * mul1 + num[0];
            else if(num[2] == num[3]) result += num[3] * mul3 + num[4] * mul2 + num[1] * mul1 + num[0];
            else result += num[4] * mul3 + num[2] * mul2 + num[1] * mul1 + num[0];
        }
        // 탑 -> 음수에서 따짐
        else{
            result  = -1000000;
            result += num[4] * mul4 + num[3] * mul3 + num[2] * mul2 + num[1] * mul1 + num[0];
        }
    }
    return result;
}

// 7장으로 만들 수 있는 가장 높은 패 확인
int check_hand(int player_hand[]){
    int result = 0; // result <- 패가 강할수록 숫자가 크도록 구현해야 함
    int now_hand[5];
    for(int not1 = 0; not1 < 7; not1++){
        for(int not2 = not1 + 1; not2 < 7; not2++){
            int cnt = 0;
            for(int i = 0; i < 7; i++){
                if(i == not1 || i == not2) continue;
                now_hand[cnt++] = player_hand[i];
            }
            int now_result = made(now_hand);
            if(now_result > result) result = now_result;
        }
    }
    return result;
}

void percentage_calculate(){

    for(int i = 0; i < player_num; i++){
        printf("%.2f%%  ", ((double)player_win[i] / (double)player_game_num[i]) * 100);
    }
    // puts("");

    for(int i = 0; i < player_num; i++) printf("%d: %d/%d  %d", i, player_win[i], player_game_num[i], all);
    puts("");
    // printf("\n%d\n", all);
}

int main()
{
    printf("Poker Game\n\n");
    init_game();
    input_dead_cards();
    // input_player_range(); -> needed

    printf("counting...\n\n");
    int all_game_num = 0;
    while(1){
        all++;
        memset(check_card, false, sizeof(check_card));
        clear_queue(output);

        Monte_Carlo();

/*
// for test => Monte_Carlo function works well
        while(!output.empty()){
            cout << output.front() << " ";
            output.pop();
        }
        cout << endl;
*/

        // 5 shared cards (if M == 3, 2 cards selected randomly)
        for(int j = M; j < 5; j++){
            shared_card[j] = output.front();
            output.pop();
        }
        
        int player_result[12];
        for(int j = 0; j < player_num; j++){
            int player_card_1 = output.front(); output.pop();
            int player_card_2 = output.front(); output.pop();
            
            if(check_card_in_player_range(j, player_card_1, player_card_2)){ // j 번 player 의 range 안에 있는 경우만 게임 진행
                int player_hand[7];
                for(int k = 0; k < 5; k++) player_hand[k] = shared_card[k];
                player_hand[5] = player_card_1;
                player_hand[6] = player_card_2;
                sort(player_hand, player_hand+7);
                player_result[j] = check_hand(player_hand);
            }
            else player_result[j] = 0; // range 안에 없는 경우 fold
        }

        int n = 0;
        for(int j = 0; j < player_num; j++){
            if(player_result[j] != 0) n++;
        }
        if(n >= 1){ // 1명 이상이 플레이한 경우
            all_game_num++;
            int highest = 0;
            queue<int> highest_user; // 가장 높은 패 들고 있는 사람
        
            for(int j = 0; j < player_num; j++){
                if(player_result[j] == 0) continue; // fold 한 사람의 경우 pass
                if(player_result[j] != 0) player_game_num[j]++; // 진행되는 경우에만 게임 횟수 추가
                
                if(highest_user.empty()){
                    highest_user.push(j); highest = j; continue;
                }

                // highest_user queue 가 비지 않았을 경우
                if(player_result[j] > player_result[highest]){ // 최고 패 변경 발생
                    highest = j;
                    clear_queue(highest_user);
                    highest_user.push(j);
                }
                else if(player_result[j] == player_result[highest]){ // 패 순위 동일
                    highest_user.push(j); // 그냥 추가
                }
                else continue;
            }

            // 최고 패가 2명 이상인 경우 전부 이겼다고 처리함
            while(!highest_user.empty()){
                player_win[highest_user.front()]++;
                highest_user.pop();
            }
            percentage_calculate();
        }
        // 전부 fold 하는 경우 마지막 플레이어가 이기지만 확률에서는 고려하지 않음
        // 한 명만 남는 경우 반드시 그 플레이어가 이기기에 고려하지 않음 (적어도 두 명 이상의 플레이 필요)
    }
    return 0;
}