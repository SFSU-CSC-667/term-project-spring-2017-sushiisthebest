/**
 * Created by euphoric on 5/17/17.
 */

module.exports = {
    checkCard: (req, res, next) =>{
       let  clientCard = {};
        switch(res.locals.card.value){
       //     case 1:
       //         console.log('bard');
       //         clientCard.name = 'bard';
       //         clientCard.targetable = false;
       //         clientCard.type ='auto';
       //         clientCard.heal = 10;
       //         break;
       //     case 2:
       //         console.log('you');
       //         clientCard.name = 'you';
       //         clientCard.targetable =true;
       //         clientCard.type ='Single Target';
       //         clientCard.damage = 10;
       //         break;
       //     case 3:
       //         console.log('me');
       //         clientCard.name = 'me';
       //         clientCard.targetable = false;
       //         clientCard.type ='auto';
       //         clientCard.damage = 10;
       //         break;
       //     case 4:
       //         console.log('WENCHES');
       //         clientCard.name = 'wenches';
       //         clientCard.targetable =false;
       //         clientCard.type ='auto';
       //         clientCard.damage = 10;
       //         break;
       //     case 5:
       //         console.log('vampire');
       //         clientCard.name = 'vampire';
       //         clientCard.targetable =true;
       //         clientCard.type ='auto';
       //         clientCard.damage = 10;
       //         clientCard.heal = 5;
       //         break;
       //     case 6:
       //         console.log('dudes');
       //         clientCard.name = 'dudes';
       //         clientCard.targetable = false;
       //         clientCard.type ='auto';
       //         clientCard.damage = 10;
       //         break;
       //     case 7:
       //         console.log('bomb');
       //         clientCard.name = 'bomb';
       //         clientCard.targetable =false;
       //         clientCard.type ='auto';
       //         clientCard.damage = 15;
       //         break;
       //     case 8:
       //         console.log('mayhem');
       //         clientCard.name = 'mayhem';
       //         clientCard.targetable =false;
       //         clientCard.type ='auto';
       //         clientCard.heal = 10;
       //         clientCard.damage =10;
       //         break;
       //     case 9:
       //         console.log('heal');
       //         clientCard.name = 'heal';
       //         clientCard.targetable = true;
       //         clientCard.type ='Single Target';
       //         clientCard.heal = 10;
       //         break;
       //     case 10:
       //         console.log('paladin');
       //         clientCard.name = 'paladin';
       //         clientCard.targetable =true;
       //         clientCard.type ='Single Target';
       //         clientCard.damage = 5;
       //         clientCard.heal = 10;
       //         break;
       //     case 11:
       //         console.log('jack');
       //         clientCard.name = 'jack';
       //         clientCard.targetable = true;
       //         clientCard.type ='thumb';
       //         clientCard.damage = 10;
       //         break;
       //     case 12:
       //         console.log('me');
       //         clientCard.name = 'me';
       //         clientCard.targetable = false;
       //         clientCard.type ='Single Target';
       //         clientCard.damage = 15;
       //         break;
       //     case 13:
       //         console.log('king');
       //         clientCard.name = 'king';
       //         clientCard.targetable = false;
       //         clientCard.type ='auto';
       //         clientCard.damage = 10;
       //         clientCard.ohFuckDamage = 50;
       //         break;
       //     case 14:
       //         break;
            default:
                console.log('king default');
                clientCard.name = 'vampire';
                clientCard.targetable =true;
                clientCard.type ='single-target';
                clientCard.damage = 10;
                clientCard.ohFuckDamage = 50;
                clientCard.heal = 10;
                break;
       }
       res.locals.clientCard = clientCard;
       next();
    }
};
