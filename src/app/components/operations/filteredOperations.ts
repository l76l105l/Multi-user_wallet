import { Component, input, computed } from "@angular/core";
import { OperationInterface } from "../../interfaces/operation-interface";

@Component({
    selector: 'filtered-operations',
    template: `
    @if(filteredOPerations().length>0){
        <table class="customized-table w-full">
        <thead>
            <tr>
                <th class="rounded-tl-2xl">From</th>
                <th>To</th>
                <th>Amount</th>
                <th class="rounded-tr-2xl">Date & Time</th>
            </tr>
        </thead>
        <tbody>
            @for(operation of filteredOPerations(); track $index){
                <tr>
                    <td>{{operation.from}}</td>
                    <td>{{operation.to}}</td>
                    <td>{{operation.amount}}</td>
                    <td>{{operation.dateTime}}</td>
                </tr>
            }
        </tbody>
    </table>
    }@else {
        <p class="text-[var(--text-page-content)] text-2xl text-center font-bold">No matching operations :/</p>
    }
    `,
})
export class FilteredOperations{
    operations=input.required<OperationInterface[]>();
    login=input<string>();
    from=input<number>();
    to=input<number>();

    filteredOPerations = computed<OperationInterface[]>(() => 
        this.operations().filter((operation)=>{
            let n=this.login();
            let f=this.from();
            let t=this.to();
            if(!n) n='';
            if(!f) f=0;
            if(!t) t= Math.max(...this.operations().map(operation=>operation.amount));
            console.log(t)
            return (operation.from.includes(n) || operation.to.includes(n)) && (operation.amount>=f && operation.amount<=t)
        })
    )
}