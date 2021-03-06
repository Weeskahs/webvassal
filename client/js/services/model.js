'use strict';

angular.module('vassalApp.services')
  .factory('model', [
    function() {
      var model_base = {
        refresh: function(game) {
          this.state.x = Math.max(this.info.r, this.state.x);
          this.state.x = Math.min(game.board.width-this.info.r,
                                  this.state.x);
          this.state.y = Math.max(this.info.r, this.state.y);
          this.state.y = Math.min(game.board.height-this.info.r,
                                  this.state.y);
        },
        moveFront: function(game, small) {
          var dl = small ? 1 : 10;
          var dx = dl * Math.sin(this.state.rot * Math.PI / 180);
          var dy = -dl * Math.cos(this.state.rot * Math.PI / 180);
          // console.log(dx + ' ' + dy);
          this.state.x += dx;
          this.state.y += dy;
          this.refresh(game);
        },
        moveBack: function(game, small) {
          var dl = small ? 1 : 10;
          var dx = -dl * Math.sin(this.state.rot * Math.PI / 180);
          var dy = dl * Math.cos(this.state.rot * Math.PI / 180);
          // console.log(dx + ' ' + dy);
          this.state.x += dx;
          this.state.y += dy;
          this.refresh(game);
        },
        rotateLeft: function(game, small) {
          var dr = small ? 5 : 30;
          this.state.rot = this.state.rot - dr;
        },
        moveLeft: function(game, small) {
          var dl = small ? 1 : 10;
          this.state.x -= dl;
          this.refresh(game);
        },
        moveUp: function(game, small) {
          var dl = small ? 1 : 10;
          this.state.y -= dl;
          this.refresh(game);
        },
        rotateRight: function(game, small) {
          var dr = small ? 5 : 30;
          this.state.rot = this.state.rot + dr;
        },
        moveRight: function(game, small) {
          var dl = small ? 1 : 10;
          this.state.x += dl;
          this.refresh(game);
        },
        moveDown: function(game, small) {
          var dl = small ? 1 : 10;
          this.state.y += dl;
          this.refresh(game);
        },
        toggleImage: function(game) {
          this.state.show_image = !this.state.show_image;
        },
        toggleMelee: function(game, val) {
          var new_val = (val === undefined) ? !this.state.show_melee : val;
          this.state.show_melee = new_val;
        },
        toggleReach: function(game, val) {
          var new_val = (val === undefined) ? !this.state.show_melee : val;
          this.state.show_reach = new_val;
        },
        toggleAoe: function(game, size) {
          switch(size) {
          case 3:
            {
              this.state.show_aoe = (this.state.show_aoe === 15) ? 0 : 15;
              break;
            }
          case 4:
            {
              this.state.show_aoe = (this.state.show_aoe === 20) ? 0 : 20;
              break;
            }
          case 5:
            {
              this.state.show_aoe = (this.state.show_aoe === 25) ? 0 : 25;
              break;
            }
          }
        },
        toggleControl: function(game) {
          if(this.info.focus) {
            this.state.show_control = !this.state.show_control;
          }
        },
        incrementFocus: function(game) {
          this.state.focus++;
        },
        decrementFocus: function(game) {
          this.state.focus = Math.max(0, this.state.focus-1);
        },
        toggleFocus: function(game) {
          this.state.show_focus = !this.state.show_focus;
        },
        startDraging: function(game) {
          this.state_before_drag = _.extend({}, this.state);
        },
        draging: function(game, dx, dy) {
          this.state.x = this.state_before_drag.x + dx;
          this.state.y = this.state_before_drag.y + dy;
          this.refresh(game);
        },
        endDraging: function(game, dx, dy) {
          this.state.x = this.state_before_drag.x + dx;
          this.state.y = this.state_before_drag.y + dy;
          this.refresh(game);
        },
        toggleDamage: function(game, col, line) {
          switch(this.info.damage.type) {
          case 'jack':
          case 'colossal':
            {
              if(undefined === line) {
                var instance = this;
                var box_in_col = _.reduce(this.info.damage[col], function(sum, n) {
                  return (n ? 1 : 0) + sum;
                }, 0);
                var damage_in_col = _.reduce(this.state.damage[col], function(sum, n) {
                  return n + sum;
                }, 0);
                var new_val = damage_in_col === box_in_col ? 0 : 1;
                _.each(this.state.damage[col], function(val, i) {
                  if(instance.info.damage[col][i]) {
                    var old_val = instance.state.damage[col][i];
                    instance.state.damage[col][i] = new_val;
                    instance.state.damage.total += new_val - old_val;
                  }
                });
                break;
              }
              if(this.info.damage[col][line]) {
                if(this.info.damage[col][line]) {
                  var old_val = this.state.damage[col][line];
                  this.state.damage[col][line] = 
                    this.state.damage[col][line] === 1 ? 0 : 1;
                  var new_val = this.state.damage[col][line];
                  this.state.damage.total += (new_val - old_val);
                }
              }
              break;
            }
          case 'warrior':
            {
              this.state.damage.n = 
                this.state.damage.n === col ? 0 : col;
              this.state.damage.total = this.state.damage.n;
              break;
            }
          }
        },
        resetAllDamage: function(game) {
          switch(this.info.damage.type) {
          case 'jack': 
            {
              this.state.damage = {
                'total': 0,
                '1': [ 0, 0, 0, 0, 0, 0 ],
                '2': [ 0, 0, 0, 0, 0, 0 ],
                '3': [ 0, 0, 0, 0, 0, 0 ],
                '4': [ 0, 0, 0, 0, 0, 0 ],
                '5': [ 0, 0, 0, 0, 0, 0 ],
                '6': [ 0, 0, 0, 0, 0, 0 ]
              };
              break;
            }
          case 'colossal': 
            {
              this.state.damage = {
                'total': 0,
                'L1': [ 0, 0, 0, 0, 0, 0 ],
                'L2': [ 0, 0, 0, 0, 0, 0 ],
                'L3': [ 0, 0, 0, 0, 0, 0 ],
                'L4': [ 0, 0, 0, 0, 0, 0 ],
                'L5': [ 0, 0, 0, 0, 0, 0 ],
                'L6': [ 0, 0, 0, 0, 0, 0 ],
                'R1': [ 0, 0, 0, 0, 0, 0 ],
                'R2': [ 0, 0, 0, 0, 0, 0 ],
                'R3': [ 0, 0, 0, 0, 0, 0 ],
                'R4': [ 0, 0, 0, 0, 0, 0 ],
                'R5': [ 0, 0, 0, 0, 0, 0 ],
                'R6': [ 0, 0, 0, 0, 0, 0 ]
              };
              break;
            }
          case 'warrior': 
            {
              this.state.damage = {
                'total': 0,
                'n': 0
              };
              break;
            }
          }
        }
      };
      var factory = function() {
        var args = Array.prototype.slice.call(arguments);
        if(args.length === 1) {
          return _.extend(args[0], model_base);
        }
        var instance = {
          info: args[1],
          state: args.length == 2 ? {
            id: args[0],
            x: 240,
            y: 240,
            rot: 0,
            focus: 0,
            label: '',
            show_image: true,
            show_melee: false,
            show_reach: false,
            show_aoe: 0,
            show_focus: args[1].type !== 'warrior',
            active: false
          } : _.extend({
            id: args[0],
            x: 240,
            y: 240,
            rot: 0,
            focus: 0,
            label: '',
            show_image: true,
            show_melee: false,
            show_reach: false,
            show_aoe: 0,
            show_focus: args[1].type !== 'warrior',
            active: false
          }, args[2])
        };
        switch(instance.info.damage.type) {
        case 'jack': 
          {
            instance.state.damage = {
              'total': 0,
              '1': [ 0, 0, 0, 0, 0, 0 ],
              '2': [ 0, 0, 0, 0, 0, 0 ],
              '3': [ 0, 0, 0, 0, 0, 0 ],
              '4': [ 0, 0, 0, 0, 0, 0 ],
              '5': [ 0, 0, 0, 0, 0, 0 ],
              '6': [ 0, 0, 0, 0, 0, 0 ]
            };
            break;
          }
        case 'colossal': 
          {
            instance.state.damage = {
              'total': 0,
              'L1': [ 0, 0, 0, 0, 0, 0 ],
              'L2': [ 0, 0, 0, 0, 0, 0 ],
              'L3': [ 0, 0, 0, 0, 0, 0 ],
              'L4': [ 0, 0, 0, 0, 0, 0 ],
              'L5': [ 0, 0, 0, 0, 0, 0 ],
              'L6': [ 0, 0, 0, 0, 0, 0 ],
              'R1': [ 0, 0, 0, 0, 0, 0 ],
              'R2': [ 0, 0, 0, 0, 0, 0 ],
              'R3': [ 0, 0, 0, 0, 0, 0 ],
              'R4': [ 0, 0, 0, 0, 0, 0 ],
              'R5': [ 0, 0, 0, 0, 0, 0 ],
              'R6': [ 0, 0, 0, 0, 0, 0 ]
            };
            break;
          }
        case 'warrior': 
          {
            instance.state.damage = {
              'total': 0,
              'n': 0
            };
            break;
          }
        }
        _.extend(instance, model_base);
        return instance;
      };
      return factory;
    }
  ]);
