import { BeforeAll, AfterAll } from 'cucumber';
import { User, closeResource } from './repository';

process.on('SIGINT', function () {
  closeResource(function() {
    console.log("Close resources due to application termination");
    process.exit(0);
  });
});

BeforeAll(function() {
  return User.deleteOne(function(err){
    if(err){
        throw err;
    } 
  });
});

AfterAll(function() {
  return User.deleteOne(function(err){
    if(err){
        throw err;
    } 
    closeResource();
  });
});