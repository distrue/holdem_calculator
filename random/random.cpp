#include <iostream>
#include <stdlib.h>
#include <math.h>
#include <ctime>
#include <algorithm>
#include <queue>
#include <vector>
using namespace std;

#define ALL_CARD_NUM 52

// [S]pade [H]eart [D]ia [C]lub
// 13으로 나눈 몫    -> 각각 0 / 1 / 2 / 3 (0~12 / 13~25 / 26~38 / 39~51)
// 13으로 나눈 나머지 -> 2~10(0~8), J(9), Q(10), K(11), A(12)

int player_num, N, M;
int all_game_num = 0;

bool input_card[52];
bool player_range[12][13][13];
vector<pair<int, int> > player_pair[12]; // range -> 가능한 pair (hand combo)

int player_win[12];
int player_hand_combo[12];
// 스트레이트 플러시 > 포카드 > 풀하우스 > 플러시 > 스트레이트 > 트리플 > 투 페어 > 원 페어 > 탑
int result_straight_flash_num[12];
int result_four_card_num[12];
int result_full_house_num[12];
int result_flush_num[12];
int result_straight_num[12];
int result_triple_num[12];
int result_two_pair_num[12];
int result_one_pair_num[12];
int result_top_num[12];

int shared_card[5]; // (in one situation, 정해진 M장 제외하고는 바뀌어야 함..!)
int player_hand[12][7]; // (in one situation)
bool check_card[52]; // (in one situation)

double result_win_percentage[12];
double result_straight_flash_percentage[12];
double result_four_card_percentage[12];
double result_full_house_percentage[12];
double result_flush_percentage[12];
double result_straight_percentage[12];
double result_triple_percentage[12];
double result_two_pair_percentage[12];
double result_one_pair_percentage[12];
double result_top_percentage[12];

void clear_queue(queue<int> &q){
    queue<int> empty;
    swap(q, empty);
}

void init_game(){
    srand((unsigned int)time(0));
    for(int i = 0; i < 5; i++) shared_card[M] = -1;
    memset(input_card, true, sizeof(input_card));
    memset(player_range, false, sizeof(player_range));
}

void init_game_every_cycle(){
    memset(player_hand, 0, sizeof(player_hand));
    memset(check_card, false, sizeof(check_card));
    for(int i = M; i < 5; i++) shared_card[i] = -1;
}

void make_pair_in_hand(int x, int y, int player, bool * input){
    if(x == y){ // 숫자가 같음 (6 hand combo)
        // for dead card counting.. (or shared card)
        if(input[x   ] == true && input[y+13] == true) player_pair[player].push_back(make_pair(x, y+13));
        if(input[x   ] == true && input[y+26] == true) player_pair[player].push_back(make_pair(x, y+26));
        if(input[x   ] == true && input[y+39] == true) player_pair[player].push_back(make_pair(x, y+39));
        if(input[x+13] == true && input[y+26] == true) player_pair[player].push_back(make_pair(x+13, y+26));
        if(input[x+13] == true && input[y+39] == true) player_pair[player].push_back(make_pair(x+13, y+39));
        if(input[x+26] == true && input[y+39] == true) player_pair[player].push_back(make_pair(x+26, y+39));
    }
    else{
        if(x > y){ // 문양이 같음 (4 hand combo)
            if(input[x   ] == true && input[y   ] == true) player_pair[player].push_back(make_pair(x, y));
            if(input[x+13] == true && input[y+13] == true) player_pair[player].push_back(make_pair(x+13, y+13));
            if(input[x+26] == true && input[y+26] == true) player_pair[player].push_back(make_pair(x+26, y+26));
            if(input[x+39] == true && input[y+39] == true) player_pair[player].push_back(make_pair(x+39, y+39));
        }
        else{ // 문양이 다름 (12 hand combo) (x, y) 로 입력이 들어오지만 실제로는 (y, x) 로 따져야 함
            if(input[y   ] == true && input[x+13] == true) player_pair[player].push_back(make_pair(y, x+13));
            if(input[y   ] == true && input[x+26] == true) player_pair[player].push_back(make_pair(y, x+26));
            if(input[y   ] == true && input[x+39] == true) player_pair[player].push_back(make_pair(y, x+39));
            if(input[y+13] == true && input[x   ] == true) player_pair[player].push_back(make_pair(y+13, x));
            if(input[y+13] == true && input[x+26] == true) player_pair[player].push_back(make_pair(y+13, x+26));
            if(input[y+13] == true && input[x+39] == true) player_pair[player].push_back(make_pair(y+13, x+39));
            if(input[y+26] == true && input[x   ] == true) player_pair[player].push_back(make_pair(y+26, x));
            if(input[y+26] == true && input[x+13] == true) player_pair[player].push_back(make_pair(y+26, x+13));
            if(input[y+26] == true && input[x+39] == true) player_pair[player].push_back(make_pair(y+26, x+39));
            if(input[y+39] == true && input[x   ] == true) player_pair[player].push_back(make_pair(y+39, x));
            if(input[y+39] == true && input[x+13] == true) player_pair[player].push_back(make_pair(y+39, x+13));
            if(input[y+39] == true && input[x+26] == true) player_pair[player].push_back(make_pair(y+39, x+26));
        }
    }
}

void input_cards(){
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
            for(int x = 0; x < 13; x++){
                for(int y = 0; y < 13; y++){
                    player_range[i-1][x][y] = true;
                    make_pair_in_hand(x, y, i-1, input_card);
                }
            }
        }
        else{
            printf("Input player %d's range..\n", i);
            for(int j = 0; j < player_range_number; j++){
                int x, y; scanf("%d%d", &x, &y);
                player_range[i-1][x][y] = true;
                make_pair_in_hand(x, y, i-1, input_card);
            }
        }
    }
}

// 각 player 에게 card 2장씩 분배 && hand combo check
void Monte_Carlo_person(){
    for(int i = 0; i < player_num; i++){
        int num = player_pair[i].size(); player_hand_combo[i] = num;
        int now_rand = rand() % num;
        int now1 = player_pair[i][now_rand].first;
        int now2 = player_pair[i][now_rand].second;
        if(now1 < now2) swap(now1, now2);

        if(input_card[now1] == false || check_card[now1] == true || input_card[now2] == false || check_card[now2] == true){
            i--; continue;
        }

        check_card[now1] = true; check_card[now2] = true;
        player_hand[i][5] = now1, player_hand[i][6] = now2;
    }
}

// 공유 카드 5 - M 장 저장 (random 한 정수), hand combo 에 영향 x!!!
void Monte_Carlo_shared(){
    for(int i = M; i < 5; i++){
        int now = rand() % 52;

        if(input_card[now] == false || check_card[now] == true){
            i--; continue;
        }

        check_card[now] = true;
        shared_card[i] = now;
    }
    
    for(int i = 0; i < 12; i++){
        for(int j = 0; j < 5; j++){
            player_hand[i][j] = shared_card[j];
        }
    }
}

int check_straight(int * num){
    int diff1 = num[1] - num[0];
    int diff2 = num[2] - num[1];
    int diff3 = num[3] - num[2];
    int diff4 = num[4] - num[3];

    if(diff1 == diff2 == diff3 == diff4 == 1) return 1; // 일반적인 경우
    // 2(0) 3(1) 4(2) 5(3) A(12)
    if(num[0] == 0 && num[1] == 1 && num[2] == 2 && num[3] == 3 && num[4] == 12) return 2; // back straight -> must be lowest
    // 2(0) 3(1) 4(2) K(11) A(12)
    if(num[0] == 0 && num[1] == 1 && num[2] == 2 && num[3] == 11 && num[4] == 12) return 1;
    // 2(0) 3(1) Q(10) K(11) A(12)
    if(num[0] == 0 && num[1] == 1 && num[2] == 10 && num[3] == 11 && num[4] == 12) return 1;
    // 2(0) J(9) Q(10) K(11) A(12)
    if(num[0] == 0 && num[1] == 9 && num[2] == 10 && num[3] == 11 && num[4] == 12) return 1;

    return 0;
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
int made(int * hand, int option, int player){
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
    // int mul5 = thirteen_multi(5); // 13^5

    if(pattern[0] == pattern[1] == pattern[2] == pattern[3] == pattern[4]){
        // 스트레이트 플러시
        if(check_straight(num) != 0){
            result  = 100000000;
            if(check_straight(num) == 1) result += num[4];

            if(option == 1) result_straight_flash_num[player]++;
        }
        // 플러시
        else{
            result  = 100000;
            result += num[4]*mul4 + num[3]*mul3 + num[2]*mul2 + num[1]*mul1 + num[0];

            if(option == 1) result_flush_num[player]++;
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

            if(option == 1) result_four_card_num[player]++;
            
        }
        // 풀하우스
        else if((num[0] == num[2] && num[3] == num[4]) || (num[2] == num[4] && num[0] == num[1])){
            result  = 1000000;
            if(num[0] == num[2]) result += num[0] * 100 + num[4];
            else result += num[0] + num[4] * 100;

            if(option == 1) result_full_house_num[player]++;
        }
        // 스트레이트
        else if(check_straight(num) != 0){
            result  = 10000;
            if(check_straight(num) == 1) result += num[4];

            if(option == 1) result_straight_num[player]++;
        }
        // 트리플
        else if(num[0] == num[2] || num[1] == num[3] || num[2] == num[4]){
            result  = 1000;
            result += num[2] * mul2; // 3개가 같으면 반드시 num[2] 에 속함
            if(num[0] == num[2]) result += num[4] * mul1 + num[3];
            else if(num[1] == num[3]) result += num[4] * mul1 + num[0];
            else result += num[1] * mul1 + num[0];

            if(option == 1) result_triple_num[player]++;
        }
        // 투 페어 -> 음수에서 따짐
        else if((num[0] == num[1] && num[2] == num[3]) || (num[0] == num[1] && num[3] == num[4]) || (num[1] == num[2] && num[3] == num[4])){
            result  = -10000;
            if(num[0] == num[1] && num[2] == num[3]) result += num[3] * mul2 + num[1] * mul2 + num[4];
            else if(num[0] == num[1] && num[3] == num[4]) result += num[4] * mul2 + num[1] * mul2 + num[2];   
            else result += num[4] * mul2 + num[2] * mul2 + num[0];

            if(option == 1) result_two_pair_num[player]++;
        }
        // 원 페어 -> 음수에서 따짐
        else if(num[0] == num[1] || num[1] == num[2] || num[2] == num[3] || num[3] == num[4]){
            result  = -100000;
            if(num[0] == num[1]) result += num[1] * mul3 + num[4] * mul2 + num[3] * mul1 + num[2];
            else if(num[1] == num[2]) result += num[2] * mul3 + num[4] * mul2 + num[3] * mul1 + num[0];
            else if(num[2] == num[3]) result += num[3] * mul3 + num[4] * mul2 + num[1] * mul1 + num[0];
            else result += num[4] * mul3 + num[2] * mul2 + num[1] * mul1 + num[0];

            if(option == 1) result_one_pair_num[player]++;
        }
        // 탑 -> 음수에서 따짐
        else{
            result  = -1000000;
            result += num[4] * mul4 + num[3] * mul3 + num[2] * mul2 + num[1] * mul1 + num[0];

            if(option == 1) result_top_num[player]++;
        }
    }
    return result;
}

// 7장으로 만들 수 있는 가장 높은 패 확인
int check_hand(int player_hand[], int player){
    int result = 0; // result <- 패가 강할수록 숫자가 크도록 구현해야 함
    int now_hand[5];
    int highest_hand[5];

    for(int not1 = 0; not1 < 7; not1++){
        for(int not2 = not1 + 1; not2 < 7; not2++){
            int cnt = 0;
            for(int i = 0; i < 7; i++){
                if(i == not1 || i == not2) continue;
                now_hand[cnt++] = player_hand[i];
            }
            int now_result = made(now_hand, 0, player);
            if(now_result > result){
                result = now_result;
                cnt = 0;
                for(int i = 0; i < 5; i++){
                    highest_hand[i] = now_hand[i];
                }
            }
        }
    }
    made(highest_hand, 1, player);
    return result;
}

void percentage_calculate(){
    for(int i = 0; i < player_num; i++){
        double result = ((double)player_win[i] / (double)all_game_num) * 100;
        result_win_percentage[i] = result;
        printf("%.2f%%  ", result);
    }
    puts("");
}

int main()
{
    printf("Poker Game\n\n");
    init_game();
    input_cards(); // dead card, 정해진 shared card, hand range 입력

    printf("counting...\n\n");
    while(1){
        all_game_num++;
        init_game_every_cycle();

        Monte_Carlo_person();
        Monte_Carlo_shared();

        int player_result[12];
        int now_player_hand[7];
        for(int j = 0; j < player_num; j++){
            for(int k = 0; k < 7; k++) now_player_hand[k] = player_hand[j][k];
            
/* hand check
            for(int k = 0; k < 7; k++) printf("%d ", now_player_hand[k]);
            puts("");
*/

            sort(now_player_hand, now_player_hand+7);
            player_result[j] = check_hand(now_player_hand, j); // j 번째 player 의 hand check
        }

        int highest = 0;
        queue<int> highest_user; // 가장 높은 패 들고 있는 사람
    
        for(int j = 0; j < player_num; j++){
            if(highest_user.empty()){
                highest_user.push(j); 
                highest = j; continue;
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
    return 0;
}