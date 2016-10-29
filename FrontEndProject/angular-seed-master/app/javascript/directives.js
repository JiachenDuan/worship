angular.module('Airpod.directives', [])
    .directive('sel', function(globalVariable) {
        return {
            template: '<select ng-model="selectedValue" ng-options="c.name for c in options"></select>',
            restrict: 'E',
            scope: false,
            scope: {
                selectedValue: '='
            },
            link:function(scope,elem,attrs){
                scope.options = [
                    {name:'buy'},
                    {name:'sell'},
                    {name:'donate'}
                ];
                console.log("sell/buy/donate? : " +globalVariable.getBusinessType())
                scope.businesstype=globalVariable.getBusinessType();
                if(scope.businesstype === "buy"){
                    scope.selectedValue= scope.options[0];
                }else if(scope.businesstype === "sell"){
                    scope.selectedValue= scope.options[1];
                }else if(scope.businesstype === "donate"){
                    scope.selectedValue= scope.options[2];
                }

            }
        }
    }
    )
    .directive('checkleftBox', function(globalVariable) {
            return {
                template: '<input type="checkbox" ng-model="checkedleft" aria-label="...">',
                restrict: 'E',
                scope: false,
                scope: {
                    checkedleft: '='
                },
                link:function(scope,elem,attrs){
                    console.log("left, right or both:" + UserPostInfoService.getLeftOfRight() )
                    scope.leftRrightBoth = UserPostInfoService.getLeftOfRight()
                    if(scope.leftRrightBoth === 'left'){
                        scope.checkedleft = true
                    }else if(scope.leftRrightBoth === 'both'){
                        scope.checkedleft = true
                    }
                }
            }
        }
    )

