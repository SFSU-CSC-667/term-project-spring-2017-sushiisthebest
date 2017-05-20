/**
 * Created by euphoric on 5/17/17.
 */

module.exports = {
    checkCard: (req, res, next) =>{
       let  clientCard = {};
        switch(res.locals.card.value){
           // case 1:
           //     console.log('YOU');
           //     clientCard.name = 'YOU';
           //     clientCard.targetable =true;
           //     clientCard.type ='Single Target';
           //     clientCard.damage = 10;
           //     break;
           // case 2:
           //     console.log('you');
           //     clientCard.name = 'YOU';
           //     clientCard.targetable =true;
           //     clientCard.type ='Single Target';
           //     clientCard.damage = 10;
           //     break;
           // case 3:
           //     console.log('me');
           //     clientCard.name = 'main';
           //     clientCard.targetable = false;
           //     clientCard.type ='auto';
           //     clientCard.damage = 10;
           //     break;
           // case 4:
           //     console.log('WENCHES');
           //     clientCard.name = 'wenches';
           //     clientCard.targetable =false;
           //     clientCard.type ='auto';
           //     clientCard.damage = 10;
           //     break;
           // case 5:
           //     console.log('bard heal');
           //     clientCard.name = 'bard';
           //     clientCard.targetable =false;
           //     clientCard.type ='auto';
           //     clientCard.heal = 5;
           //     break;
           // case 6:
           //     console.log('dudes');
           //     clientCard.name = 'dudes';
           //     clientCard.targetable = false;
           //     clientCard.type ='auto';
           //     clientCard.damage = 10;
           //     break;
           // case 7:
           //     console.log('bomb');
           //     clientCard.name = 'bomb';
           //     clientCard.targetable =true;
           //     clientCard.type ='auto';
           //     clientCard.damage = 15;
           //     break;
           // case 8:
           //     console.log('mate');
           //     clientCard.name = 'YOU';
           //     clientCard.targetable =true;
           //     clientCard.type ='mate';
           //     break;
           // case 9:
           //     console.log('YOU');
           //     clientCard.name = 'YOU';
           //     clientCard.targetable =true;
           //     clientCard.type ='Single Target'; clientCard.damage = 10;
           //     break;
           // case 10:
           //     console.log('YOU');
           //     clientCard.name = 'YOU';
           //     clientCard.targetable =true;
           //     clientCard.type ='Single Target';
           //     clientCard.damage = 10;
           //     break;
           // case 11:
           //     console.log('jack');
           //     clientCard.name = 'jack';
           //     clientCard.targetable =true;
           //     clientCard.type ='thumb';
           //     clientCard.damage = 10;
           //     break;
           // case 12:
           //     console.log('YOU');
           //     clientCard.name = 'YOU';
           //     clientCard.targetable =true;
           //     clientCard.type ='Single Target';
           //     break;
           // case 13:
           //     console.log('king');
           //     clientCard.name = 'king';
           //     clientCard.targetable =true;
           //     clientCard.type ='auto';
           //     clientCard.damage = 5;
           //     clientCard.ohFuckDamage = 50;
           //     break;
           // case 14:
           //     break;
            default:
                console.log('dudes');
                clientCard.name = 'dudes';
                clientCard.targetable =false;
                clientCard.type ='auto';
                clientCard.damage = 10;
                break;
       }
       res.locals.clientCard = clientCard;
       next();
    }
};
