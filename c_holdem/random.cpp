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

double play_time, sum_time;
int player_num, sharedcard_num;
int all_game_num = 0;

bool input_card[52];
vector<pair<int, int> > player_pair[12]; // range -> 가능한 pair (hand combo)

int player_solo_win[12];
double player_draw_win[12];
int player_win[12];

int player_range_num[12];
int player_order[12];
int player_hand_combo[12];
// (0)AA (1)KK (2)QQ (3)JJ (4)TT (5)66-99 (6)22-55 (7)ace_high (8)no_made_hand (9)overcards(ace_high + no_made_hand)
int player_hand_combo_classify[12][10];

// 스트레이트 플러시 > 포카드 > 풀하우스 > 플러시 > 스트레이트 > 트리플 > 투 페어 > 원 페어 > 탑
int result_straight_flush_num[12];
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
double result_straight_flush_percentage[12];
double result_four_card_percentage[12];
double result_full_house_percentage[12];
double result_flush_percentage[12];
double result_straight_percentage[12];
double result_triple_percentage[12];
double result_two_pair_percentage[12];
double result_one_pair_percentage[12];
double result_top_percentage[12];

void input_time(){
    // printf("\tInput Play Time(sec): ");
    scanf("%lf", &play_time);
}

void error_handling(char * str){
    // printf("%s\n", str);
    exit(1);
}

void clear_queue(queue<int> &q){
    queue<int> empty;
    swap(q, empty);
}

void init_game(){
    srand((unsigned int)time(0));
    for(int i = 0; i < 5; i++) shared_card[i] = -1;
    memset(input_card, true, sizeof(input_card));
}

void init_game_every_cycle(){
    memset(player_hand, 0, sizeof(player_hand));
    memset(check_card, false, sizeof(check_card));
    for(int i = sharedcard_num; i < 5; i++) shared_card[i] = -1;
}

void input_cards(){
    // printf("\tInput Player number: ");
    scanf("%d", &player_num);
    // printf("\tInput Fixed Shared Card number: ");
    scanf("%d", &sharedcard_num);
    // printf("\tInput Fixed Shared cards.\n");
    for(int i = 0; i < sharedcard_num; i++){
        int x; printf("\t  "); scanf("%d", &x);
        shared_card[i] = x;
        input_card[x] = false; // shared card not counted in hand combo
    }
    // puts("");

    for(int i = 0; i < player_num; i++){
        int player_range_number;
        // printf("\tInput player %d range number: ", i+1);
        scanf("%d", &player_range_number);

        if(player_range_number == 0){ // 0 == 전부 선택 (for test 편의)
            for(int x = 51; x >= 0; x--){
                for(int y = x-1; y >= 0; y--){
                    if(input_card[x] == false || input_card[y] == false) continue;
                    player_pair[i].push_back(make_pair(x, y));
                }
            }
        }
        else{
            // printf("\tInput player %d's hand range. \n", i+1);
            for(int j = 0; j < player_range_number; j++){
                int x, y; scanf("%d%d", &x, &y);
                // printf("\t  "); 
                if(input_card[x] == false || input_card[y] == false) continue;
                if(x < y) swap(x, y); // must be x > y
                player_pair[i].push_back(make_pair(x, y));
            }
        }
        player_range_num[i] = player_pair[i].size();
    }
}

void player_ordering(){
    int tmp[12];
    int count = 0;

    for(int i = 0; i < player_num; i++) tmp[i] = player_range_num[i];
    sort(tmp, tmp + player_num);

    for(int i = 0; i < player_num; i++){
        for(int j = 0; j < player_num; j++){
            if(tmp[i] == player_range_num[j]){
                player_order[i] = j;
                player_range_num[j] = -1;
                break;
            }
        }
    }
}

void calculate_hand_combo(){ // 각 player의 hand combo 계산
    for(int i = 0; i < player_num; i++) player_hand_combo[i] = player_pair[i].size();
}

// 각 player 에게 card 2장씩 분배 && hand combo check
void Monte_Carlo_person(){
    clock_t check_time = clock();

    for(int i = 0; i < player_num; i++){
        int now = player_order[i]; // i -> player_order[i] (now)

        int num = player_hand_combo[now];
        if(num == 0) error_handling("\t[Error] Impossible Range Setting\n");
        int now_rand = rand() % num;

        int now1 = player_pair[now][now_rand].first;
        int now2 = player_pair[now][now_rand].second;
        if(now1 < now2) swap(now1, now2);

        double spending = (double)(clock() - check_time);
        if(spending > 300) error_handling("\t[Error] Impossible Range Setting\n");

        if(input_card[now1] == false || check_card[now1] == true || input_card[now2] == false || check_card[now2] == true){
            i--; continue;
        }

        check_card[now1] = true; check_card[now2] = true;
        player_hand[now][5] = now1, player_hand[now][6] = now2;
    }
}

// 공유 카드 5 - M 장 저장 (random 한 정수), hand combo 에 영향 x!!!
void Monte_Carlo_shared(){
    for(int i = sharedcard_num; i < 5; i++){
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

    if(diff1 == 1 && diff2 == 1 && diff3 == 1 && diff4 == 1) return 1; // 일반적인 straight -> num[4] 가 대소 결정
    // 2(0) 3(1) 4(2) 5(3) A(12)
    if(num[0] == 0 && num[1] == 1 && num[2] == 2 && num[3] == 3 && num[4] == 12) return 2; // back straight -> must be lowest
    
    // J Q K A 2 는 스트레이트로 인정하지 않음..!
    return 0;
}

int thirteen_multi(int n){ // 13^n 반환
    int x = 1;
    while(n--){
        x *= 13;
    }
    return x;
}

// for testing..
void hand_7_check(int * hand){
    int num[7], pattern[7];
    for(int i = 0; i < 7; i++){
        num[i] = hand[i] % 13; pattern[i] = hand[i] / 13;
    }

    for(int i = 0; i < 7; i++){
        if(num[i] <= 8){
            if(pattern[i] == 0) printf("%d: Spade / %d    ", hand[i], num[i]+2);
            else if(pattern[i] == 1) printf("%d: Heart / %d    ", hand[i], num[i]+2);
            else if(pattern[i] == 2) printf("%d: Diamond / %d    ", hand[i], num[i]+2);
            else if(pattern[i] == 3) printf("%d: Club / %d    ", hand[i], num[i]+2);
            else printf("error detected...\n");
        }
        else if(num[i] == 9){
            if(pattern[i] == 0) printf("%d: Spade / J    ", hand[i]);
            else if(pattern[i] == 1) printf("%d: Heart / J    ", hand[i]);
            else if(pattern[i] == 2) printf("%d: Diamond / J    ", hand[i]);
            else if(pattern[i] == 3) printf("%d: Club / J    ", hand[i]);
            else printf("error detected...\n");
        }
        else if(num[i] == 10){
            if(pattern[i] == 0) printf("%d: Spade / Q    ", hand[i]);
            else if(pattern[i] == 1) printf("%d: Heart / Q    ", hand[i]);
            else if(pattern[i] == 2) printf("%d: Diamond / Q    ", hand[i]);
            else if(pattern[i] == 3) printf("%d: Club / Q    ", hand[i]);
            else printf("error detected...\n");
        }
        else if(num[i] == 11){
            if(pattern[i] == 0) printf("%d: Spade / K    ", hand[i]);
            else if(pattern[i] == 1) printf("%d: Heart / K    ", hand[i]);
            else if(pattern[i] == 2) printf("%d: Diamond / K    ", hand[i]);
            else if(pattern[i] == 3) printf("%d: Club / K    ", hand[i]);
            else printf("error detected...\n");
        }
        else if(num[i] == 12){
            if(pattern[i] == 0) printf("%d: Spade / A    ", hand[i]);
            else if(pattern[i] == 1) printf("%d: Heart / A    ", hand[i]);
            else if(pattern[i] == 2) printf("%d: Diamond / A    ", hand[i]);
            else if(pattern[i] == 3) printf("%d: Club / A    ", hand[i]);
            else printf("error detected...\n");
        }
        else printf("error detected..\n");
    }
    puts("");
}

// for testing..
void hand_check(int * hand, int * pattern, int * num, int make){
    if(make == 1) printf("Straight Flush!!!\n");
    else if(make == 2) printf("Four Card!!!\n");
    else if(make == 3) printf("Full House!!!\n");
    else if(make == 4) printf("Flush!!!\n");
    else if(make == 5) printf("Straight!!!\n");
    else if(make == 6) printf("Triple!!!\n");
    else if(make == 7) printf("Two Pair!!!\n");
    else if(make == 8) printf("One Pair!!\n");
    else if(make == 9) printf("Top!\n");
    else printf("error detected.. (in hand check func)\n");
    
    for(int i = 0; i < 5; i++){
        if(num[i] <= 8){
            if(pattern[i] == 0) printf("%d: Spade / %d    ", hand[i], num[i]+2);
            else if(pattern[i] == 1) printf("%d: Heart / %d    ", hand[i], num[i]+2);
            else if(pattern[i] == 2) printf("%d: Diamond / %d    ", hand[i], num[i]+2);
            else if(pattern[i] == 3) printf("%d: Club / %d    ", hand[i], num[i]+2);
            else printf("error detected...\n");
        }
        else if(num[i] == 9){
            if(pattern[i] == 0) printf("%d: Spade / J    ", hand[i]);
            else if(pattern[i] == 1) printf("%d: Heart / J    ", hand[i]);
            else if(pattern[i] == 2) printf("%d: Diamond / J    ", hand[i]);
            else if(pattern[i] == 3) printf("%d: Club / J    ", hand[i]);
            else printf("error detected...\n");
        }
        else if(num[i] == 10){
            if(pattern[i] == 0) printf("%d: Spade / Q    ", hand[i]);
            else if(pattern[i] == 1) printf("%d: Heart / Q    ", hand[i]);
            else if(pattern[i] == 2) printf("%d: Diamond / Q    ", hand[i]);
            else if(pattern[i] == 3) printf("%d: Club / Q    ", hand[i]);
            else printf("error detected...\n");
        }
        else if(num[i] == 11){
            if(pattern[i] == 0) printf("%d: Spade / K    ", hand[i]);
            else if(pattern[i] == 1) printf("%d: Heart / K    ", hand[i]);
            else if(pattern[i] == 2) printf("%d: Diamond / K    ", hand[i]);
            else if(pattern[i] == 3) printf("%d: Club / K    ", hand[i]);
            else printf("error detected...\n");
        }
        else if(num[i] == 12){
            if(pattern[i] == 0) printf("%d: Spade / A    ", hand[i]);
            else if(pattern[i] == 1) printf("%d: Heart / A    ", hand[i]);
            else if(pattern[i] == 2) printf("%d: Diamond / A    ", hand[i]);
            else if(pattern[i] == 3) printf("%d: Club / A    ", hand[i]);
            else printf("error detected...\n");
        }
        else printf("error detected..\n");
    }
    puts("");
}

// 5장으로 만들 수 있는 조합 만드는 함수
// 패 강함에 따라 숫자 부여, 대소관계로 패 비교
// 스트레이트 플러시(1) > 포카드(2) > 풀하우스(3) > 플러시(4) > 스트레이트(5) > 트리플(6) > 투 페어(7) > 원 페어(8) > 탑(9)
int made(int * hand, int option, int player){
    int result = 0;
    int num[5], pattern[5];
    for(int i = 0; i < 5; i++) pattern[i] = hand[i] / 13;
    for(int i = 0; i < 5; i++) num[i] = hand[i] % 13;
    
    for(int i = 0; i < 5; i++){
        for(int j = i+1; j < 5; j++){
            if(num[i] > num[j]){
                swap(hand[i], hand[j]); swap(num[i], num[j]); swap(pattern[i], pattern[j]); // hand - num - pattern must be moved simultaneously
            }
        }
    }
    // 숫자 기준 오름차순 정렬 완료

    int mul1 = thirteen_multi(1); // 13^1
    int mul2 = thirteen_multi(2); // 13^2
    int mul3 = thirteen_multi(3); // 13^3
    int mul4 = thirteen_multi(4); // 13^4
    // int mul5 = thirteen_multi(5); // 13^5

    int chk_straight = check_straight(num);
    if(pattern[0] == pattern[1] && pattern[1] == pattern[2] && pattern[2] == pattern[3] && pattern[3] == pattern[4]){
        // 스트레이트 플러시
        if(chk_straight != 0){
            result  = 100000000;
            if(chk_straight == 1) result += num[4];

            if(option == 1){
                                // for checking..
                                // hand_check(hand, pattern, num, 1);

                result_straight_flush_num[player]++;
            }
        }
        // 플러시
        else{
            result  = 100000;
            // 같은 N 플러시인 경우 이하의 패를 통해 우열을 가릴 수 있어야 한다
            result += num[4] * mul4 + num[3] * mul3 + num[2] * mul2 + num[1] * mul1 + num[0];

            if(option == 1){
                                // for checking..
                                // hand_check(hand, pattern, num, 4);

                result_flush_num[player]++;
            }
        }
    }
    else{ // 플러시 제외
        // 포카드
        if(num[0] == num[1] && num[1] == num[2] && num[2] == num[3] || num[0] == num[1] && num[1] == num[2] && num[2] == num[4] || num[0] == num[1] && num[1] == num[3] && num[3] == num[4] || num[0] == num[2] && num[2] == num[3] && num[3] == num[4] || num[1] == num[2] && num[2] == num[3] && num[3] == num[4]){
            result  = 10000000;
            if(num[0] == num[1] && num[1] == num[2] && num[2] == num[3]) result += num[3] * 10000 + num[4];
            else if(num[0] == num[1] && num[1] == num[2] && num[2] == num[4]) result += num[4] * 10000 + num[3];
            else if(num[0] == num[1] && num[1] == num[3] && num[3] == num[4]) result += num[4] * 10000 + num[2];
            else if(num[0] == num[2] && num[2] == num[3] && num[3] == num[4]) result += num[4] * 10000 + num[1];
            else result += num[4] * 10000 + num[0];

            if(option == 1){
                                // for checking..
                                // hand_check(hand, pattern, num, 2);

                result_four_card_num[player]++;
            }
            
        }
        // 풀하우스
        else if((num[0] == num[2] && num[3] == num[4]) || (num[2] == num[4] && num[0] == num[1])){
            result  = 1000000;
            if(num[0] == num[2]) result += num[0] * 100 + num[4];
            else result += num[0] + num[4] * 100;

            if(option == 1){
                                // for checking..
                                // hand_check(hand, pattern, num, 3);

                result_full_house_num[player]++;
            }
        }
        // 스트레이트
        else if(chk_straight != 0){
            result  = 10000;
            if(chk_straight == 1) result += num[4]; // not back_straight

            if(option == 1){
                                // for checking..
                                // hand_check(hand, pattern, num, 5);

                result_straight_num[player]++;
            }
        }
        // 트리플
        else if(num[0] == num[2] || num[1] == num[3] || num[2] == num[4]){
            result  = 1000;
            result += num[2] * mul2; // 3개가 같으면 반드시 num[2] 에 속함
            if(num[0] == num[2]) result += num[4] * mul1 + num[3];
            else if(num[1] == num[3]) result += num[4] * mul1 + num[0];
            else result += num[1] * mul1 + num[0];

            if(option == 1){
                                // for checking..
                                // hand_check(hand, pattern, num, 6);

                result_triple_num[player]++;
            }
        }
        // 투 페어 -> 음수에서 따짐
        else if(num[0] == num[1] && num[2] == num[3] || num[0] == num[1] && num[3] == num[4] || num[1] == num[2] && num[3] == num[4]){
            result  = -10000;
            if(num[0] == num[1] && num[2] == num[3]) result += num[3]*mul2 + num[1]*mul2 + num[4];
            else if(num[0] == num[1] && num[3] == num[4]) result += num[4]*mul2 + num[1]*mul2 + num[2];   
            else result += num[4]*mul2 + num[2]*mul2 + num[0];

            if(option == 1){
                                // for checking..
                                // hand_check(hand, pattern, num, 7);

                result_two_pair_num[player]++;
            }
        }
        // 원 페어 -> 음수에서 따짐
        else if(num[0] == num[1] || num[1] == num[2] || num[2] == num[3] || num[3] == num[4]){
            result  = -100000;
            if(num[0] == num[1]) result += num[1]*mul3 + num[4]*mul2 + num[3]*mul1 + num[2];
            else if(num[1] == num[2]) result += num[2]*mul3 + num[4]*mul2 + num[3]*mul1 + num[0];
            else if(num[2] == num[3]) result += num[3]*mul3 + num[4]*mul2 + num[1]*mul1 + num[0];
            else result += num[4]*mul3 + num[2]*mul2 + num[1]*mul1 + num[0];

            if(option == 1){
                                // for checking..
                                // hand_check(hand, pattern, num, 8);

                result_one_pair_num[player]++;
            }
        }
        // 탑 -> 음수에서 따짐
        else{
            result  = -1000000;
            result += num[4] * mul4 + num[3] * mul3 + num[2] * mul2 + num[1] * mul1 + num[0];

            if(option == 1){
                                // for checking..
                                // hand_check(hand, pattern, num, 9);

                result_top_num[player]++;
            }
        }
    }
    return result;
}

// 7장으로 만들 수 있는 가장 높은 패 확인
int check_hand(int * player_hand, int player){
    int result = -2147483648; // result <- 패가 강할수록 숫자가 크도록 구현해야 함
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
            if(now_result > result){ // 현재 패가 기존 최상위 패보다 강한 경우
                result = now_result; // 현재 패를 최상위 패로 변경
                for(int k = 0; k < 5; k++){
                    highest_hand[k] = now_hand[k];
                }
            }
        }
    }
    made(highest_hand, 1, player);
    return result; // 가장 높은 패 숫자 반환
}

void print_player_hand_combo(){
    for(int i = 0; i < player_num; i++) printf("  [ player %d Hand combo ]: %d\n", i+1, player_hand_combo[i]);
}

void print_percentage_calculate(){
    for(int i = 0; i < player_num; i++){
        double solo_win_ratio = ((double)player_solo_win[i] / (double)all_game_num) * 100;
        double draw_win_ratio = (player_draw_win[i] / (double) all_game_num) * 100;
        result_win_percentage[i] = solo_win_ratio + draw_win_ratio;
        
        printf("\n  [ player %d Equity ]\n", i+1);
        printf("\t %.2f%% ( 1 win: %.2f%% / 2 or more win: %.2f%% )\n", result_win_percentage[i], solo_win_ratio, draw_win_ratio);
    }
    puts("");
}

// 만들어지는 hand 퍼센티지 체크
// 스티플 > 포카드 > 풀하우스 > 플러쉬 > 스트레이트 > 트리플 > 투페어 > 원페어 > 탑
void print_made_hand_percentage(){
    for(int i = 0; i < player_num; i++){
        result_straight_flush_percentage[i] = (double) result_straight_flush_num[i] / all_game_num * 100;
        result_four_card_percentage[i] = (double) result_four_card_num[i] / all_game_num * 100;
        result_full_house_percentage[i] = (double) result_full_house_num[i] / all_game_num * 100;
        result_flush_percentage[i] = (double) result_flush_num[i] / all_game_num * 100;
        result_straight_percentage[i] = (double) result_straight_num[i] / all_game_num * 100;
        result_triple_percentage[i] = (double) result_triple_num[i] / all_game_num * 100;
        result_two_pair_percentage[i] = (double) result_two_pair_num[i] / all_game_num * 100;
        result_one_pair_percentage[i] = (double) result_one_pair_num[i] / all_game_num * 100;
        result_top_percentage[i] = (double) result_top_num[i] / all_game_num * 100;
    }
    
    // for testing...
    for(int i = 0; i < player_num; i++){
        printf("\n  [ player %d result Ratio ]\n", i+1);
        printf("\t Straight Flush: %.2f%% (Frequency: %d) \n", result_straight_flush_percentage[i], result_straight_flush_num[i]);
        printf("\t Four Card:      %.2f%% (Frequency: %d) \n", result_four_card_percentage[i], result_four_card_num[i]);
        printf("\t Full House:     %.2f%% (Frequency: %d) \n", result_full_house_percentage[i], result_full_house_num[i]);
        printf("\t Flush:          %.2f%% (Frequency: %d) \n", result_flush_percentage[i], result_flush_num[i]);
        printf("\t Straight:       %.2f%% (Frequency: %d) \n", result_straight_percentage[i], result_straight_num[i]);
        printf("\t Triple:         %.2f%% (Frequency: %d) \n", result_triple_percentage[i], result_triple_num[i]);
        printf("\t Two Pair:       %.2f%% (Frequency: %d) \n", result_two_pair_percentage[i], result_two_pair_num[i]);
        printf("\t One Pair:       %.2f%% (Frequency: %d) \n", result_one_pair_percentage[i], result_one_pair_num[i]);
        printf("\t Top:            %.2f%% (Frequency: %d) \n", result_top_percentage[i], result_top_num[i]);
        printf("\n\n");
    }
    printf("\n  [ Total result Ratio ]\n");
    printf("\t Probability:    %.2f%% (Frequency: %d) \n", 100.0, all_game_num);
    printf("\n\n");
}

int main()
{
    // printf("\n  * Holdem Game *\n\n");
    init_game();
    input_time();
    input_cards(); // dead card, 정해진 shared card, hand range 입력
    player_ordering(); // range num 기준 순서 정하기 (먼저 hand 배분할 순서)
    calculate_hand_combo(); // dead card 가 전부 주어졌으므로 hand combo 수 계산 가능

    printf("\n  counting...\n\n");
    sum_time = 0;
    while(1){
        if(sum_time >= play_time) break; 
        clock_t start_time = clock();
        all_game_num++;

        init_game_every_cycle();
        Monte_Carlo_person();
        Monte_Carlo_shared();

        int player_result[12];
        int now_player_hand[7];
        for(int j = 0; j < player_num; j++){
            for(int k = 0; k < 7; k++) now_player_hand[k] = player_hand[j][k];
            
                        // hand_7_check(now_player_hand);
            sort(now_player_hand, now_player_hand+7);
            player_result[j] = check_hand(now_player_hand, j); // j 번째 player 의 hand check
                        // printf("%d\n", player_result[j]);
        }

        int highest = 0, in_queue_num = 0;
        queue<int> highest_user; // 가장 높은 패 들고 있는 사람
    
        for(int j = 0; j < player_num; j++){
            if(highest_user.empty()){
                in_queue_num = 1;
                highest_user.push(j); 
                highest = j; continue;
            }

            // highest_user queue 가 비지 않았을 경우
            if(player_result[j] > player_result[highest]){ // 최고 패 변경 발생
                highest = j;
                in_queue_num = 1;
                clear_queue(highest_user);
                highest_user.push(j);
            }
            else if(player_result[j] == player_result[highest]){ // 패 순위 동일
                in_queue_num++;
                highest_user.push(j); // 그냥 추가
            }
            else continue;
        }

        if(in_queue_num == 1){
            player_solo_win[highest_user.front()]++;
            player_win[highest_user.front()]++;
            highest_user.pop();
        }
        else{
            while(!highest_user.empty()){
                player_draw_win[highest_user.front()] += 1 / (double)in_queue_num;
                player_win[highest_user.front()]++;
                highest_user.pop();
            }
        }
        
        clock_t end_time = clock();
        sum_time += (end_time / CLOCKS_PER_SEC) - (start_time / CLOCKS_PER_SEC);
    }
    print_player_hand_combo();
    print_percentage_calculate();
    print_made_hand_percentage();
    return 0;
}