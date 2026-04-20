let navigateFunction=null;
function setNavigate(nav){
  navigateFunction=nav;
}
function navigateTo(path){
  if(navigateFunction)
    navigateFunction(path);
}
export {setNavigate,navigateTo};