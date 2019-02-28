<template>
  <div>
    <v-layout
      justify-center
      align-center
    >
      <v-responsive
      class="bgright2 white--text"
      height="130"
      > 
        <v-card height="100%" style="background-color:#ffffffcf;">
          <v-container>
          <v-layout row fill-height >
            <div>
              <div class="display-1">Categories</div>
              <div class="body-1 font-weight-light ">"Art is never finished, only abandoned." - Leonardo da Vinci</div>
            </div>
          </v-layout>
          </v-container>
        </v-card>
      </v-responsive>
    </v-layout>
    <v-container  >
   
    <v-toolbar 
      class="teal lighten-3" flat 
      
    >
      <v-toolbar-title class="teal--text">List of Category</v-toolbar-title>
      <!-- <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider> -->
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        class="jiebtn"
        solo-inverted
        single-line
        dark
        color="teal"
        hide-details
        flat
      ></v-text-field>
      <v-btn depressed @click="newItem" color="white" dark class="textNone caption teal--text mb-2">New Item</v-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="categoryData"
      class="mt-3 elevation-1 teal"
      :loading="categoryLoadingdata"
      :search="search"
    >
     
      <template v-if="props.item.keyIndex != 'test'" slot="items" slot-scope="props">
        
        <td>{{ props.item.cname }}</td>
        <td>{{ props.item.description }}</td>
        <td v-if="props.item.total != 0" class="green--text"> {{props.item.total}} </td>
        <td v-else class="error--text"> {{props.item.total}} </td>
        <td class="">
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteDialog(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
      <div slot="no-results" :value="true">
        <v-layout align-center="">
         <v-icon color="error">mdi-alert</v-icon>
         <span class="error--text ml-2">Your search for "{{ search }}" found no results.</span>
        </v-layout>
      </div>
    </v-data-table>
    
    <v-dialog
      persistent
      :value="dialogEdit"
      width="500"
    >
      <v-card>
          <v-card-title>
            <span class="headline"> {{headlineTitle}}  </span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12  >
                  <v-text-field :error-messages="cateValidmessage" color="teal" ref="cnameRefs" v-model="editedItem.cname" label="Category name"></v-text-field>
                </v-flex>
                <v-flex xs12  >
                  <v-text-field color="teal"  v-model="editedItem.description" label="Description"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="teal darken-1" flat @click="cancel">Cancel</v-btn>
            <v-btn v-if="headlineTitle != 'Add category'" :disabled="saveValid" color="teal darken-1" flat @click="editItemSave(editedItem)">Save</v-btn>
            <v-btn v-else color="teal darken-1"  :disabled="saveValid"  flat @click="addCategoryData">Save</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog
      v-model="deletedialog"
      width="300"
    >
      <v-card>
        <v-card-title>
          <span class="body-2 mb-2"> Are you sure you want to delete this item?  </span>
          <span class="caption error--text"> All products that included in this category will also be deleted</span>

        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            @click="deletedialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            flat
            @click="deleteItembtn"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-container>

    <v-snackbar
      bottom
      right
      color="white"
      v-model="snackbar"
    > 
    <span class="teal--text">{{snackbarMessage}}</span>
    </v-snackbar>
  </div>
</template>

<script>
  import firebase from 'firebase'
  export default {
    data () {
      return {
        search: '',
        headers: [
          { text: 'Category name', value: 'cname' , sortable: true},
          { text: 'Description', value: 'description', sortable: false},
          { text: 'Total products', value: 'total', sortable: false },
          { text: 'Actions',  value: false,sortable: false},
        ],
        categorys: [],
        categoryLength: '',
        categoryLoadingdata: false,
        dialogEdit: false,
        editedItem: {
          cname: '',
          dummycname: '',
          description:'',
          keyIndex:''
        },
        headlineTitle: '',
        snackbar: false,
        snackbarMessage: '',
        deletedialog: false,
        deleteItem: {
          category: '',
          key:''
        },
      }
    },
    created() {
      this.getCategoryData()
    },
    computed: {
      cateValidmessage() {
        var droptest = _.dropRight(this.categoryData)
        var findThis = _.find(droptest, ['cname', _.capitalize(this.editedItem.cname)])
        if(findThis && _.capitalize(this.editedItem.cname) !=  _.capitalize(this.editedItem.dummycname) ) {
          return 'Category name already exist'
        } else {
          return ''
        }
      },
      cateValid() {
        var droptest = _.dropRight(this.categoryData)
        var findThis = _.find(droptest, ['cname', _.capitalize(this.editedItem.cname)])
        if(findThis && _.capitalize(this.editedItem.cname) !=  _.capitalize(this.editedItem.dummycname) ) {
          return true
        } else {
          return false
        }
      },
      saveValid() {
        if( this.cateValid || this.editedItem.cname ==  '' || this.editedItem.description == '') {
          return true
        }
          return false
      },
      categoryData() {
        if(this.categorys.length > 1) {
          return _.orderBy(this.categorys, 'order');
        } else {
          return []
        }
      },
    },
    methods: {
      getCategoryData() {
        let vm = this
        vm.categoryLoadingdata = true
        var categoryRef = firebase.database()
        var getCategory = categoryRef.ref('Category');
        getCategory.on('value', function(getData) {
          let keys = Object.keys(getData.val())
          vm.categorys = getData.val();
          keys.forEach( function (key) {
            vm.categorys[key].keyIndex = key
          })
          vm.categorys = _.orderBy(vm.categorys, 'order');
          vm.categoryLoadingdata = false
        })
      },
      addCategoryData() {
        let vm = this
        var categoryRef = firebase.database()
        var pushCategory = categoryRef.ref('Category').push()
        pushCategory.set({
          cname: _.capitalize(vm.editedItem.cname),
          description:  _.capitalize(vm.editedItem.description),
          total:  0
        }, function (error) {
          if(error) {
            alert('something is wrong')
          } else {
            vm.$refs.cnameRefs.focus()
            vm.snackbar = true
            vm.snackbarMessage = `Successfully added  ${_.capitalize(vm.editedItem.cname)}`
            vm.editedItem = { cname: '', description: '', keyIndex: ''}
          }
        })
      },
      newItem() {
        this.headlineTitle = 'Add category'
        this.dialogEdit = true
        this.$refs.cnameRefs.focus()
      },
      deleteDialog(item) {
        this.deletedialog = true
        this.deleteItem = {
          key : item.keyIndex,
          category: item.cname
          }

      },
      deleteItembtn() {
        let vm = this
        var categoryRef = firebase.database()
        categoryRef.ref(`Category/${vm.deleteItem.key}`).remove()
        
        var getProduct = firebase.database().ref(`Product`)
        getProduct.on('value', function(getData) {
          let keys = Object.keys(getData.val())
          var hold = _.mapValues(getData.val(), ['category', vm.deleteItem.category]);
          // console.log(getData.val())
          // var drop = _.takeWhile(hold, true)
          keys.forEach( function (key) {
            if(hold[key]) {
              firebase.database().ref(`Product/${key}`).remove()
            }
          })
        })

        vm.snackbar = true
        vm.snackbarMessage = `Successfully deleted`
        this.deletedialog = false
      },
      editItemSave(item) {
        let vm = this 
        var categoryRef = firebase.database()
        var updateCategory = categoryRef.ref(`Category/${item.keyIndex}`)
        updateCategory.update({
          cname: _.capitalize(vm.editedItem.cname),
          description: _.capitalize(vm.editedItem.description)
        }, function (error) {
          if(error) {
            alert('something is wrong')
          } else {
            vm.dialogEdit = false
            vm.snackbar = true
            vm.snackbarMessage = `Successfully Updated ${_.capitalize(vm.editedItem.cname)}`
            vm.editedItem = { cname: '', description: '', keyIndex: ''}
          }
        })
        if(vm.editedItem.cname != vm.editedItem.dummycname) {
          var getProduct = firebase.database().ref(`Product`)
          getProduct.on('value', function(getData) {
            let keys = Object.keys(getData.val())
            var hold = _.mapValues(getData.val(), ['category', vm.editedItem.dummycname]);
            // console.log(getData.val())
            // var drop = _.takeWhile(hold, true)
            keys.forEach( function (key) {
              if(hold[key]) {
                firebase.database().ref(`Product/${key}`).update({
                  category: vm.editedItem.cname
                })
              }
            })
          })
        } else {
          // do nothing jie 
        }

       
      },
      editItem(item) {
        let vm = this
        vm.$refs.cnameRefs.focus()
        this.headlineTitle = 'Edit category'
        this.dialogEdit = true
        this.editedItem = { cname: item.cname, dummycname: item.cname, description: item.description, keyIndex: item.keyIndex}
      },
      cancel() {
        this.dialogEdit = false
        this.editedItem = { cname: '', description:'', keyIndex: ''}
      }
    }
  }
</script>
