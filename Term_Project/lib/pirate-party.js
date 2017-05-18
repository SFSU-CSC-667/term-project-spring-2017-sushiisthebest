/**
 * Created by euphoric on 5/17/17.
 */

module.exports = {
    checkCard: (req, res, next) =>{
       let  clientCard = {};
        switch(res.locals.card.value){
           case 1:
               console.log('YOU');
               clientCard.name = 'YOU';
               clientCard.targetable =true;
               clientCard.type ='Single Target';
               clientCard.damage = 10;
               break;
           case 2:
               console.log('YOU');
               clientCard.name = 'YOU';
               clientCard.targetable =true;
               clientCard.type ='Single Target';
               clientCard.damage = 10;
               break;
           case 3:
               console.log('YOU');
               clientCard.name = 'YOU';
               clientCard.targetable =true;
               clientCard.type ='Single Target';
               clientCard.damage = 10;
               break;
           case 4:
               console.log('YOU');
               clientCard.name = 'YOU';
               clientCard.targetable =true;
               clientCard.type ='Single Target';
               clientCard.damage = 10;
               break;
           case 5:
               console.log('YOU');
               clientCard.name = 'YOU';
               clientCard.targetable =true;
               clientCard.type ='Single Target';
               clientCard.damage = 10;
               break;
           case 6:
               console.log('YOU');
               clientCard.name = 'YOU';
               clientCard.targetable =true;
               clientCard.type ='Single Target';
               clientCard.damage = 10;
               break;
           case 7:
               console.log('YOU');
               clientCard.name = 'YOU';
               clientCard.targetable =true;
               clientCard.type ='Single Target';
               clientCard.damage = 10;
               break;
           case 8:
               console.log('YOU');
               clientCard.name = 'YOU';
               clientCard.targetable =true;
               clientCard.type ='Single Target';
               clientCard.damage = 10;
               break;
           case 9:
               console.log('YOU');
               clientCard.name = 'YOU';
               clientCard.targetable =true;
               clientCard.type ='Single Target'; clientCard.damage = 10;
               break;
           case 10:
               console.log('YOU');
               clientCard.name = 'YOU';
               clientCard.targetable =true;
               clientCard.type ='Single Target';
               clientCard.damage = 10;
               break;
           case 11:
               console.log('YOU');
               clientCard.name = 'YOU';
               clientCard.targetable =true;
               clientCard.type ='Single Target';
               clientCard.damage = 10;
               break;
           case 12:
               console.log('YOU');
               clientCard.name = 'YOU';
               clientCard.targetable =true;
               clientCard.type ='Single Target';
               break;
           case 13:
               console.log('YOU');
               clientCard.name = 'YOU';
               clientCard.targetable =true;
               clientCard.type ='Single Target';
               clientCard.damage = 10;
               break;
           case 14:
               break;
       }
       res.locals.clientCard = clientCard;
       next();
    }
};
